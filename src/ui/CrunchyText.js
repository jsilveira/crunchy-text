import React, {Component} from 'react';

import InputBar from './InputBar.js';
import SearchBar from './SearchBar.js';
import SearchResults from './SearchResults.js';
import CoreWorkerProxy from "../core/CoreWorkerProxy";
import DrilldownFiltersBar from "./DrilldownFiltersBar";
import downloadFile from "../utils/downloadFile";

//const sampleURL = 'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json';
const sampleData = require('../../public/samples/sample-data.json');

async function fetchSample() {
  return await (await fetch(sampleURL)).json()
}


let last = new Date().valueOf();
console.logTime = (text, ... other) => {
  let now = new Date().valueOf();
  console.log(`[+${now - last}ms] ${text.toString()}`, ... other)
  last = now;
}

export default class CrunchyText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileInput: {name: 'sample', data: []},
      search: '(?:luz|icono|testigo|simbolo|dibujo|alarma)(?: (?:la|el|del?))+ (\\w+)',
      results: null,
      drillDownSteps: [],
      inputSettings: null,
      stats: {}
    };

    this.searchChanged = this.searchChanged.bind(this);

    this.coreWorker = new CoreWorkerProxy();
    this.coreWorker.loadData(sampleData);

    this.fileInputChanged = this.fileInputChanged.bind(this);

    setTimeout(() => {
      this.search();
    }, 20)

    this.coreWorker.onLoadProgress(progress => this.setState({progress}))

    this.coreWorker.onSearchDone((results) => {
      this.setState({results, stats: results.stats, progress: ""});
    })

    this.coreWorker.onFileProgress(({progress}) => {
      console.logTime("Loading file", progress);
      this.setState({progress})
    })

    this.coreWorker.onPartialSearchResult((results) => {

      if(!results.extras) {
        results.extras = this.state.results.extras;
      }
      this.setState({ results, stats: results.stats });
    })

    this.coreWorker.onDrilldownStepsUpdate(steps => this.setState({drillDownSteps: steps}))
  }

  onInputProgress(progress) {
    this.setState({progress})
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

  preprocessorsChanged(preprocessors) {
    preprocessors.forEach(p => p.className = p.name)
    this.coreWorker.setPreprocessors(preprocessors);
  }

  searchChanged(search) {
    this.setState({search}, () => this.search())
  }

  async downloadResults() {
    const data = await this.coreWorker.getFilteredData();
    const exportedData = data.map(({itemText}) => itemText);

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
      <div>
        <InputBar value={this.state.fileInput}
                  onChange={this.fileInputChanged.bind(this)}
                  onPreprocessorChange={this.preprocessorsChanged.bind(this)}/>

        <SearchBar value={this.state.search} onChange={this.searchChanged.bind(this)} onDrilldownAction={this.drilldownAction.bind(this)}/>

        <DrilldownFiltersBar drilldownSteps={this.state.drillDownSteps} onDrilldownAction={this.drilldownAction.bind(this)}/>

        <SearchResults progress={this.state.progress} res={this.state.results} onDownloadResults={this.downloadResults.bind(this)}/>
      </div>
    );
  }
}
