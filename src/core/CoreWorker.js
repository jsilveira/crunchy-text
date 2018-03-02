// self.onmessage=function(e){postMessage('Worker: '+e.data);}
import _ from "../lib/lodash.js"

import RemoveSpecialChars from "./preprocessors/RemoveSpecialChars";
import RemoveStopWords from "../core/preprocessors/RemoveStopWords";

let items = [];

let topMatches = {};
let partial = false;

let searching = false;
let lastSearchTime = 0;
let progressSent = false;
let nextTick = 0;

let re = new RegExp(/.*/g);

export default class CoreWorker {
  progressCbk;
  constructor(loggerCbk, progressCbk) {
    this.loggerFn = loggerCbk;
    this.progressCbk = progressCbk;

    this.preprocessors = [];

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

    if(items.length === 0) return;
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
      for (i = START; i < items.length; i++) {
        const den = items[i];
        const itemText = (den || "").toString();

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

            this.sendProgress("loadProgress", `Searching ${(START / items.length * 100).toFixed(0)}%`);
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

      if(i < items.length){
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
            totalCount: items.length
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
        items.push(processedItem)
      } catch (err) {
        console.error(err, doc)
      }

      if (new Date() - lastStatus > 100) {
        this.sendProgress("loadProgress", "Preprocessing " + data.length + " strings... (" + (100 * index / data.length).toFixed(1) + "%)");
        lastStatus = new Date();
      }
    });

    this.sendProgress("loadProgress", "Done parsing and preprocessing data.");
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
}



