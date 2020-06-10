// self.onmessage=function(e){postMessage('Worker: '+e.data);}
import _ from "../lib/lodash.js"

import RemoveSpecialChars from "./preprocessors/RemoveSpecialChars";
import RemoveStopWords from "../core/preprocessors/RemoveStopWords";
import {RawDataLoader} from "./data-loaders/RawDataLoader";
import SearchableText from "./searchable-data/SearchableText";

let items = [];
let filteredItems = [];

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

      reader.onload = async (e) => {
        this.sendProgress("loadFile", {progress: `Reading file structure...`})

        console.time('parseData')
        let data = await RawDataLoader.loadFileData(file, reader.result);
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
    this.searchableData = new SearchableText(filteredItems);
  }

  // Called by worker.js
  setPreprocessors(preprocessorsConfigs) {
    this.preprocessors = _.map(_.filter(preprocessorsConfigs, c => c.enabled), config => {
      return new this.preprocessorsClasses[config.className](config);
    })
    this.preprocessData(this.data);
    this.search(this.lastSearch);
  }

  search(searchParams) {
    this.lastSearch = searchParams;
    this.searchableData.search(searchParams, (... args) => this.sendProgress(... args));
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



