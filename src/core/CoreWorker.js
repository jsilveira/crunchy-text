// self.onmessage=function(e){postMessage('Worker: '+e.data);}
import _ from "../lib/lodash.js"

import RemoveSpecialChars from "./preprocessors/RemoveSpecialChars";
import RemoveStopWords from "../core/preprocessors/RemoveStopWords";

let items = [];
let filteredItems = [];

let topMatches = {};
let partial = false;

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

    this.preprocessorsClasses = {}
    _.map(
      [
        RemoveSpecialChars,
        RemoveStopWords
      ],
      cls => this.preprocessorsClasses[cls.name] = cls)
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
    let sampleMatches = [];
    this.matchesIndex = [];

    let startTime = new Date();
    let lastPause = new Date();

    const resume = (START, query) => {
      let i = 0;
      for (i = START; i < filteredItems.length; i++) {
        const itemText = filteredItems[i];

        let execRes = null;
        let matches = [];
        let lastIndex = null;
        while (execRes = re.exec(itemText)) {
          // Prevent infinite loop if the regex does not consume characters
          if(execRes.index === lastIndex)
            break;

          topMatches[execRes[0]] = (topMatches[execRes[0]] || 0) + 1
          matches.push(execRes)
          lastIndex = execRes.index;
        }

        if(matches.length > 0) {
          this.matchesIndex.push(i);
          if (sampleMatches.length < 2000) {
            sampleMatches.push({itemText, matches: matches});
          }
        }

        // Check only in some iterations for performance
        if(i % 100 === 0) {
          // Make periodical pauses to
          if (new Date() - lastPause > 30) {
            lastPause = new Date();
            START = i;

            this.sendProgress("loadProgress", `Searching ${(START / filteredItems.length * 100).toFixed(0)}%`);
            // partial = true;
            // finalTopMatches = _.sortBy(_.toPairs(JSON.parse(JSON.stringify(topMatches))), "1").reverse();
            // sendProgress(q);
            break;
          }

          if (new Date() - startTime > 35 && !progressSent) {
            partial = true;
            // topMatches = _.sortBy(_.toPairs(topMatches), "1").reverse();
            // this.sendProgress(query);
            progressSent = true;
          }
        }
      }

      if(i < filteredItems.length){
        nextTick = setTimeout(() => resume(START, query), 0);
      } else {
        topMatches = _.sortBy(_.toPairs(topMatches), "1").reverse();
        partial = false;
        searching = false;
        lastSearchTime = new Date().valueOf() - startTime;

        this.sendProgress('searchDone', {
          matchSamples: sampleMatches.slice(0, 2000),
          stats: {
            searchTime: lastSearchTime,
            matchesCount: this.matchesIndex.length,
            totalCount: filteredItems.length
          },
          extras: {topMatches}
        });
      }
    };

    clearTimeout(nextTick);

    resume(0, regex.toString());
  }

  preprocessData(data){
    this.sendProgress("loadProgress", "Preprocessing " + data.length + " strings...");

    let lastStatus = new Date();

    items = [];
    _.each(data, (doc, index) => {
      try {
        let processedItem = doc;
        if(!_.isString(processedItem)) {
          if(_.isObject(processedItem)) {
            processedItem = JSON.stringify(processedItem)
          }
        }

        this.preprocessors.forEach(preproc => processedItem = preproc.syncProcess(processedItem));
        items.push(((processedItem || "").toString()))
      } catch (err) {
        console.error(err, doc)
      }

      if (new Date() - lastStatus > 100) {
        this.sendProgress("loadProgress", "Preprocessing " + data.length + " strings... (" + (100 * index / data.length).toFixed(1) + "%)");
        lastStatus = new Date();
      }
    });

    this.sendProgress("loadProgress", "Done parsing and preprocessing data.");

    this.applyDrilldownFilters();
  }

  applyDrilldownFilters() {
    this.sendProgress("loadProgress", "Building prefiltered data set strings...");
    let lastStatus = new Date();

    if (this.drilldownActions.length === 0) {
      filteredItems = items;
      return;
    }

    filteredItems = [];

    _.each(items, (doc, index) => {
      if (new Date() - lastStatus > 100) {
        this.sendProgress("loadProgress", "Preprocessing " + items.length + " strings... (" + (100 * index / items.length).toFixed(1) + "%)");
        lastStatus = new Date();
      }

      for (let step of this.drilldownActions) {
        if(!step.isOn)
          continue;

        let matched = step.regex.test(doc);

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
        affectedCount: 50,
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

    this.sendProgress('drilldownStepsUpdate', this.drilldownActions)
    this.applyDrilldownFilters();
    this.search(this.lastSearch);
  }
}



