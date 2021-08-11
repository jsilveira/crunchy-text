// self.onmessage=function(e){postMessage('Worker: '+e.data);}
import _ from "../lib/lodash.js"

import RemoveSpecialChars from "./preprocessors/RemoveSpecialChars.js";
import RemoveStopWords from "./preprocessors/RemoveStopWords.js";
import {RawDataLoader} from "./data-loaders/RawDataLoader.js";
import SearchableTextList from "./searchable-data/SearchableTextList.js";
import SearchableTabularList from "./searchable-data/SearchableTabularList.js";


export default class CoreWorker {
  progressCbk;
  constructor(loggerCbk, progressCbk) {
    this.loggerFn = loggerCbk;
    this.progressCbk = progressCbk;

    this.preprocessors = [];
    this.drilldownActions = [];

    this.data = [];
    this.preprocessedData = [];
    this.filteredItems = [];
    this.filterCount = 1;

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
    //TODO: Breaking encapsulation. Fix. Also fix exported format ¿JSON? ¿CSV?
    return _.map(this.searchableData.lastFilteredResults, i => this.data[i]);
  }

  preprocessData(data){
    console.time('preprocessData')
    this.sendProgress("loadProgress", "Preprocessing " + data.length + " strings...");

    let lastStatus = new Date();

    this.preprocessedData = [];
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

        this.preprocessedData.push(processedItem || "");
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
      this.filteredItems = this.preprocessedData;
      return;
    }

    this.filteredItems = [];

    // REset affected items count
    for (let step of this.drilldownActions) {
      step.affectedCount = 0;
    }

    _.each(this.preprocessedData, (doc, index) => {
      if (new Date() - lastStatus > 100) {
        this.sendProgress("loadProgress", "Preprocessing " + this.preprocessedData.length + " strings... (" + (100 * index / this.preprocessedData.length).toFixed(1) + "%)");
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

      this.filteredItems.push(doc)

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
        console.error(evt.target.error);
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
        await this.loadRawTextData(file,  reader.result);
        resolve();
      };

      // Read in the image file as a binary string.
      reader.readAsText(file);
    })
  }

  async loadRawTextData(file, fileTextdata) {
    this.sendProgress("loadFile", {progress: `Reading file structure...`})

    console.time('parseData')
    let data = await RawDataLoader.loadFileData(file, fileTextdata);
    console.timeEnd('parseData')

    this.sendProgress("loadFile", {progress: `Preprocessing file...`})

    this.loadDataWithFormat(data);
  }

  // Called by worker.js
  loadDataWithFormat({dataFormat, data}) {
    this.data = data;
    this.dataFormat = dataFormat;

    // TODO: Add support to preprocess to different dataFormats
    this.preprocessData(data)

    this.updateSearchableData();
  }

  updateSearchableData() {
    switch (this.dataFormat.type) {
      case 'text':
      case 'tabularText':
        this.searchableData = new SearchableTextList(this.filteredItems, this.dataFormat);
        break;
      case 'tabular':
        this.searchableData = new SearchableTabularList(this.filteredItems, this.dataFormat);
        break;
      default:
        this.error(`Unsupported dataFormat "${this.dataFormat.type}"`);
    }
  }

  // Called by worker.js
  setPreprocessors(preprocessorsConfigs) {
    this.preprocessors = _.map(_.filter(preprocessorsConfigs, c => c.enabled), config => {
      return new this.preprocessorsClasses[config.className](config);
    })
    if(this.data?.length) {
      this.preprocessData(this.data);
      this.updateSearchableData();
      this.search(this.lastSearch);
    }
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
        id: this.filterCount++
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
    this.updateSearchableData();
    this.sendProgress('drilldownStepsUpdate', this.drilldownActions)
    this.search(this.lastSearch);
  }
}



