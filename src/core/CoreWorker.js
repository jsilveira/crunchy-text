// self.onmessage=function(e){postMessage('Worker: '+e.data);}
import _ from "../lib/lodash.js"

import RemoveSpecialChars from "./preprocessors/RemoveSpecialChars";
import RemoveStopWords from "../core/preprocessors/RemoveStopWords";
import {DataLoader} from "./DataLoader";

let items = [];
let filteredItems = [];

let topMatches = {};

let searching = false;
let lastSearchTime = 0;
let progressSent = false;
let nextTick = 0;

let re = new RegExp(/.*/g);

let filterCount = 1;

export default class CoreWorker {
  progressCbk;
  constructor(loggerCbk, progressCbk) {
    this.loggerFn = loggerCbk;
    this.progressCbk = progressCbk;

    this.preprocessors = [];
    this.drilldownActions = [];

    this.preprocessorsClasses = {
      RemoveSpecialChars: RemoveSpecialChars,
      RemoveStopWords: RemoveStopWords,
    }
  }

  log(... msg) {
    if(this.loggerFn) {
      this.loggerFn(... msg)
    }
  }

  sendProgress(msg, progressData){
    this.progressCbk(msg, progressData);
  }

  search(regex) {
    this.lastSearch = regex;
    if(!regex) {
      regex = /.*/g;
    }

    if(filteredItems.length === 0) return;
    re = regex;

    searching = true;

    progressSent = false;
    topMatches = {};
    let uniqueCount = 0;
    let sampleMatches = [];
    this.matchesIndex = [];

    let startTime = new Date();
    let searchId = new Date().valueOf();
    let lastPause = new Date();
    let lastProgressSent = new Date();

    const resume = (START, query) => {
      let i = 0;
      for (i = START; i < filteredItems.length; i++) {
        const itemText = filteredItems[i];

        let execRes = null;
        let matches = null;
        let lastIndex = null;
        while (execRes = re.exec(itemText)) {
          // Prevent infinite loop if the regex does not consume characters
          if(execRes.index === lastIndex)
            break;

          for(let groupIndex = 0; groupIndex < execRes.length;groupIndex++) {
            let match = execRes[groupIndex] || "-";

            topMatches[groupIndex] = topMatches[groupIndex] || {};
            let matchCount = topMatches[groupIndex][match];
            if (!matchCount)
              uniqueCount++;
            topMatches[groupIndex][match] = (matchCount || 0) + 1;
          }
          (matches = matches || []).push(execRes)
          lastIndex = execRes.index;
        }

        if(matches) {
          this.matchesIndex.push(i);
          if (sampleMatches.length < 2000) {
            sampleMatches.push({itemText, matches: matches});
          }
        }

        // Check only in some iterations for performance
        if(i % 1000 === 0) {
          // Make periodical pauses to check search should not be cancelled
          if (new Date() - lastPause > 50) {
            lastPause = new Date();
            START = i;

            this.sendProgress("loadProgress", `Searching ${(START / filteredItems.length * 100).toFixed(0)}%`);

            break;
          }

          if (new Date() - startTime > 35 && (!progressSent || new Date() - lastProgressSent > 250)) {
            this.sendProgress('partialSearchResult', {
              matchSamples: sampleMatches.slice(0, 50),
              searchId: searchId,
              stats: {
                matchesCount: this.matchesIndex.length,
                totalCount: filteredItems.length
              }
            });
            lastProgressSent = new Date();
            progressSent = true;
          }
        }
      }

      if(i < filteredItems.length){
        nextTick = setTimeout(() => resume(START, query), 0);
      } else {
        topMatches = _.mapValues(topMatches, groupTop => _.sortBy(_.toPairs(groupTop), "1").reverse());
        searching = false;
        lastSearchTime = new Date().valueOf() - startTime;

        // TODO: Needed for download results. Stop doing this EVERY TIME
        // and only do it, searching again, if someone clicks export results
        // Then change `if (sampleMatches.length < 100000) {` to `< 2000`
        this.lastFilteredResults = sampleMatches;

        this.sendProgress('searchDone', {
          matchSamples: sampleMatches.slice(0, 2000),
          stats: {
            searchTime: lastSearchTime,
            matchesCount: this.matchesIndex.length,
            totalCount: filteredItems.length
          },
          extras: {
            topMatches,
            matchesCount: this.matchesIndex.length
          }
        });
      }
    };

    clearTimeout(nextTick);

    resume(0, regex.toString());
  }

  async getFilteredData() {
    return this.lastFilteredResults;
  }

  preprocessData(data){
    console.time('preprocessData')
    this.sendProgress("loadProgress", "Preprocessing " + data.length + " strings...");

    let lastStatus = new Date();

    items = [];
    let index = 0;
    for(const doc of data) {
      try {
        let processedItem = doc;

        if(!_.isString(processedItem)) {
          if(_.isObject(processedItem)) {
            processedItem = JSON.stringify(processedItem)
          }
        }

        for(const preproc of this.preprocessors) {
          processedItem = preproc.syncProcess(processedItem)
        }

        items.push(processedItem || "");
      } catch (err) {
        console.error(err, doc)
      }

      if ((index % 100 === 0) && new Date() - lastStatus > 100) {
        this.sendProgress("loadProgress", "Preprocessing " + data.length + " strings... (" + (100 * index / data.length).toFixed(1) + "%)");
        lastStatus = new Date();
      }
      index++;
    }

    this.sendProgress("loadProgress", "Done parsing and preprocessing data.");

    this.applyDrilldownFilters();

    console.timeEnd('preprocessData')
  }

  applyDrilldownFilters() {
    this.sendProgress("loadProgress", "Building prefiltered data set strings...");
    let lastStatus = new Date();

    if (this.drilldownActions.length === 0) {
      filteredItems = items;
      return;
    }

    filteredItems = [];

    // REset affected items count
    for (let step of this.drilldownActions) {
      step.affectedCount = 0;
    }

    _.each(items, (doc, index) => {
      if (new Date() - lastStatus > 100) {
        this.sendProgress("loadProgress", "Preprocessing " + items.length + " strings... (" + (100 * index / items.length).toFixed(1) + "%)");
        lastStatus = new Date();
      }

      for (let step of this.drilldownActions) {
        if(!step.isOn)
          continue;

        let matched = step.regex.test(doc);

        if(matched) {
          step.affectedCount++;
        }

        step.regex.lastIndex = 0; // REset the regex just in case multiple matches, as it has global flag
        if(step.type === "filter" && !matched)
          return;

        if(step.type === "exclude" && matched)
          return;
      }

      filteredItems.push(doc)

    });

    this.sendProgress("loadProgress", "Done prefiltering data.");
  }

  error(err) {
    this.sendProgress('error', err);
  }

  async loadFile(file) {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = (evt) => {
        switch (evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
            reject('File Not Found!')
            break;
          case evt.target.error.NOT_READABLE_ERR:
            reject('File is not readable');
            break;
          case evt.target.error.ABORT_ERR:
            break; // noop
          default:
            reject('An error occurred reading this file.');
        }
        this.sendProgress("loadFile", {loading: false});
      };

      reader.onprogress = ({lengthComputable, loaded, total}) => {
        // evt is an ProgressEvent.
        if (lengthComputable) {
          let progressPer = loaded/total*100;
          const percentLoaded = Math.round(progressPer);
          if (percentLoaded < 100) {
            // console.log(`${new Date()} Loading ${percentLoaded}% (${file.name})`);
          }
          this.sendProgress("loadFile", {progress: `Loading file ${progressPer.toFixed(0)}%`})
        }
      };

      reader.onabort = (e) => {
        reject('File read cancelled');
      };

      reader.onloadstart = (e) => {
        this.sendProgress("loadFile", {progress: `Loading file 0%`})
      };

      reader.onload = (e) => {
        this.sendProgress("loadFile", {progress: `Reading file structure...`})

        console.time('parseData')
        let data = DataLoader.loadFileData(file, reader.result);
        console.timeEnd('parseData')

        this.sendProgress("loadFile", {progress: `Preprocessing file...`})

        this.loadData(data);

        resolve();
      };

      // Read in the image file as a binary string.
      reader.readAsText(file);
    })
  }

  // Called by worker.js
  loadData(data) {
    this.data = data;
    this.preprocessData(data)
  }

  // Called by worker.js
  setPreprocessors(preprocessorsConfigs) {
    this.preprocessors = _.map(_.filter(preprocessorsConfigs, c => c.enabled), config => {
      return new this.preprocessorsClasses[config.className](config);
    })
    this.preprocessData(this.data);
    this.search(this.lastSearch);
  }

  // Called by worker.js
  drilldownAction(action, ... params) {
    if(action === 'addFilter' || action === 'addExclusion') {
      if(!this.lastSearch)
        return;

      this.drilldownActions.push({
        searchQuery: this.lastSearch.toString(),
        regex: this.lastSearch,
        isOn: true,
        type: action === 'addFilter' ? 'filter' : 'exclude',
        affectedCount: 0,
        id: filterCount++
      });
    } else if(action === 'toggleFilter') {
      let [filterId] = params;
      let step = _.find(this.drilldownActions, {id: filterId});
      if(step) {
        step.isOn = !step.isOn;
      }
    } else if(action === 'remove') {
      let [filterId] = params;
      if(!filterId && this.drilldownActions.length) {
        filterId = this.drilldownActions[this.drilldownActions.length - 1].id
      }
      _.remove(this.drilldownActions, s => s.id === filterId)
    }

    this.applyDrilldownFilters();
    this.sendProgress('drilldownStepsUpdate', this.drilldownActions)
    this.search(this.lastSearch);
  }
}



