// self.onmessage=function(e){postMessage('Worker: '+e.data);}
import _ from "../lib/lodash.js"

let stringTest = [];
let items = [];
let filtradas = [];
let topMatches = {};
let partial = false;

let searching = false;
let lastSearchTime = 0;
let progressSent = false;
let nextTick = 0;

let re = new RegExp();

export default class CoreWorker {
  progressCbk;
  constructor(loggerCbk, progressCbk) {
    this.loggerFn = loggerCbk;
    this.progressCbk = progressCbk;
  }


  getJSON(url, sucessCbk, errCbk = ()=>console.error(err)) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        sucessCbk(JSON.parse(request.responseText));
      } else {
        errCbk("Error " + request.status)
      }
    };

    request.onerror = function (err) {
      errCbk(err)
    };

    request.send();
  }

  log(... msg) {
    if(this.loggerFn) {
      this.loggerFn(... msg)
    }

    //if(msg) console.debug(msg)
  }

  sendProgress(msg, progressData){
    this.progressCbk(msg, progressData);
    /*self.postMessage({action: 'search-result', res: {
        filtradas: filtradas.slice(0, 500000),
        filtradasLength: filtradas.length,
        partial,
        lastSearchTime,
        topMatches
      }});
    console.log(`Search progress con '${query}'`)*/
  }


  search(regex) {
    if(!regex) {
      regex = /.*/g;
    }

    if(items.length === 0) return;
    re = regex;

    searching = true;

    progressSent = false;
    topMatches = {};
    filtradas = [];

    let START = 0;

    let startTime = new Date();
    let lastPause = new Date();

    const resume = (START, query) => {
      let i = 0;
      for (i = START; i < items.length; i++) {
        let den = items[i];
        let m = (den || "").toString().match(re);
        if (m) {
          for(let g of m) {
            topMatches[g] = (topMatches[g] || 0) + 1
          }
          filtradas.push(den);
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
          filteredItems: filtradas.slice(0, 500000),
          stats: {
            searchTime: lastSearchTime
          },
          extras: {topMatches}
        });
      }
    };

    clearTimeout(nextTick);
    resume(START, regex.toString());
  }


  // Sample data loaded
  // parseDataObject(sampleData)

  nonCircularObjectToString(doc) {
    if(typeof doc === "object") {
      return _.map(_.values(doc), this.nonCircularObjectToString).join(" ||| ")
    } else {
      return (doc || "").toString()
    }
  }

  parseDataObject(data){
    items = [];
    this.sendProgress("loadProgress", "Preprocessing " + data.length + " strings...");

    let lastStatus = new Date();
    _.each(data, (doc, index) => {
      if(_.isObject(doc)){
        doc = this.nonCircularObjectToString(doc)
      }

      try {
        let cleanSearch = removeDiacriticsCasero(doc || "").trim();
        // cleanSearch = removeStopWords(cleanSearch)
        items.push(cleanSearch)
      } catch (err) {
        console.error(err, doc)
      }

      if (new Date() - lastStatus > 400) {
        this.sendProgress("loadProgress", "Processing " + data.length + " strings... (" + (100 * index / data.length).toFixed(1) + "%)");
        lastStatus = new Date();
      }
    });

    this.log(``);

    filtradas = items
    stringTest = items.slice(0, 10000);
  }

  loadData(data) {
    this.parseDataObject(data)
  }

  // loadFile(input) {
  //   log("Loading huge file...");
  //   this.getJSON(input, this.parseDataObject, (e) => {
  //     this.log(`Error loading '${input}': ${e.toString()}`)
  //   });
  // }
}

const cleanupRegexes = [
  [new RegExp("[àáâãäå]", 'g'), "a"],
  [new RegExp("æ", 'g'), "ae"],
  [new RegExp("ç", 'g'), "c"],
  [new RegExp("[èéêë]", 'g'), "e"],
  [new RegExp("[ìíîï]", 'g'), "i"],
  [new RegExp("ñ", 'g'), "n"],
  [new RegExp("[òóôõö]", 'g'), "o"],
  [new RegExp("œ", 'g'), "oe"],
  [new RegExp("[ùúûü]", 'g'), "u"],
  [new RegExp("[ýÿ]", 'g'), "y"]

]
function removeDiacriticsCasero(s) {
  if (s) {
    s = s.toLowerCase();
    _.each(cleanupRegexes, ([regex, replace]) => s = s.replace(regex, replace))
  }
  return s;
}
