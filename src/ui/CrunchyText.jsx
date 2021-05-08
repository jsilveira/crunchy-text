import React, {Component} from 'react';
import _ from 'lodash';


import InputBar from './input-bar/InputBar';
import SearchBar from './search-bar/SearchBar';
import SearchResults from './search-results/SearchResults';
import CoreWorkerProxy from "../core/CoreWorkerProxy";
import DrilldownFiltersBar from "./search-bar/DrilldownFiltersBar";
import downloadFile from "../utils/downloadFile";

//const sampleURL = 'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json';
import sampleData from '../../public/samples/sample-data.json';
// const sampleData = [];
// const sampleTabularData = [
//   "col A\tcolB\tcolC",
//   "Short\tMedium length row\tLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// ]

async function fetchSample() {
  return await (await fetch(sampleURL)).json()
}


let last = new Date().valueOf();
console.logTime = (text, ... other) => {
  let now = new Date().valueOf();
  console.log(`[+${now - last}ms] ${text.toString()}`, ... other)
  last = now;
}

window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  }

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  }

export default class CrunchyText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileInput: {name: 'sample', data: []},
      // search: '(?:luz|icono|testigo|simbolo|dibujo|alarma)(?: (?:la|el|del?))+ (\\w+)',
      search: '',
      results: null,
      drillDownSteps: [],
      inputSettings: null,
      stats: {}
    };

    this.searchChanged = this.searchChanged.bind(this);

    this.coreWorker = new CoreWorkerProxy();
    this.coreWorker.loadDataWithFormat({dataFormat: {type: 'text'}, data: sampleData});
    // this.coreWorker.loadDataWithFormat({dataFormat: {type: 'tabularText', delimiter: '\t'}, data: sampleTabularData});

    this.fileInputChanged = this.fileInputChanged.bind(this);

    setTimeout(() => {
      this.search();
    }, 20)

    this.coreWorker.onLoadProgress(progress => this.setState({progress}))

    this.coreWorker.onSearchDone((results) => {
      console.log("%cSearch done.", "color: green;")
      this.setState({results, stats: results.stats, progress: ""});
    })

    this.coreWorker.onFileProgress(({progress}) => {
      console.logTime("Loading file", progress);
      this.setState({progress})
    })

    let pendingId = null;
    this.coreWorker.onPartialSearchResult((results) => {
      if(!results.extras) {
        results.extras = this.state.results?.extras;
      }
      const update = () => {
        console.log("%cSearch progress: "+results.searchId, 'color: red;')
        this.setState({results, stats: results.stats});
      };

      cancelIdleCallback(pendingId);
      pendingId = requestIdleCallback(update)
    })

    this.coreWorker.onDrilldownStepsUpdate(steps => this.setState({drillDownSteps: steps}))
  }

  search() {
    try {
      this.coreWorker.search(new RegExp(this.state.search, 'igm'));
    } catch (err) {
      this.setState({invalidInput: true})
    }
  }

  async fileInputChanged({name, file}) {
    console.logTime(`Sending file ${name} to worker`)

    this.setState({fileInput: {name, file}})

    await this.coreWorker.loadFile(file);

    console.logTime(`File loaded by worker.`)

    this.search()
  }

  async inputDataChanged(file, fileData) {
    let name = file.name;
    console.logTime(`Sending file data ${name} to worker`)

    this.setState({fileInput: {name, file}})

    await this.coreWorker.loadRawTextData(file, fileData);

    console.logTime(`File loaded by worker.`)

    this.search()
  }

  preprocessorsChanged(preprocessors) {
    preprocessors.forEach(p => p.className = p.name)
    this.coreWorker.setPreprocessors(preprocessors);
  }

  searchChanged(search) {
    this.setState({search}, () => this.search())
  }

  async downloadResults() {
    const exportedData = await this.coreWorker.getFilteredData();

    let fileName = `${this.state.fileInput.name}-filtered.json`;

    downloadFile(JSON.stringify(exportedData, true, 4), fileName, 'text/plain');
  }

  drilldownAction(actionName, ... params) {
    this.coreWorker.drilldownAction(actionName, ... params);

    if(actionName === "addFilter" || actionName === "addExclusion") {
      this.setState({search: ""})
      setTimeout(() => this.search(), 20)
    }
  }


  render() {
    let {search, inputSettings, drillDownSteps, progress, results} = this.state;

    return (
      <div className={'container-fluid'}>
        <InputBar value={this.state.fileInput}
                  onChange={this.fileInputChanged.bind(this)}
                  onPreprocessorChange={this.preprocessorsChanged.bind(this)}/>

        <div className={'bg-dark row align-items-center pb-2 pt-2 px-4'}>
          <div className={'col-6 gx-0'}>
            <SearchBar value={this.state.search} onChange={this.searchChanged.bind(this)} onDrilldownAction={this.drilldownAction.bind(this)}/>
          </div>
          <div className={'col-6 gx-0'}>
            <DrilldownFiltersBar drilldownSteps={this.state.drillDownSteps} onDrilldownAction={this.drilldownAction.bind(this)}/>
          </div>
        </div>

        <div className={'mx-2'}>
        <SearchResults search={this.state.search} progress={this.state.progress} res={this.state.results} onDownloadResults={this.downloadResults.bind(this)}/>
        </div>
      </div>
    );
  }
}
