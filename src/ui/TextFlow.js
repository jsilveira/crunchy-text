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

const coreWorker = new CoreWorkerProxy();

export default class TextFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: {name: 'sample', data: []},
      search: 'de \\w+',
      results: null,
      drillDownSteps: [],
      inputSettings: null,
      stats: {}
    };

    this.searchChanged = this.searchChanged.bind(this);
    this.textInputChanged = this.textInputChanged.bind(this);

    coreWorker.loadData(sampleData);
    setTimeout(() => {
      this.search();
    }, 20)

    coreWorker.onLoadProgress(progress => this.setState({progress}))
    coreWorker.onSearchDone((results) => this.setState({results, stats: results.stats, progress: ""}))
    coreWorker.onPartialSearchResult((results) => {
      if(!results.extras) {
        results.extras = this.state.results.extras;
      }
      this.setState({ results, stats: results.stats });
    })
    coreWorker.onDrilldownStepsUpdate(steps => this.setState({drillDownSteps: steps}))
  }

  search() {
    try {
      coreWorker.search(new RegExp(this.state.search, 'igm'));
    } catch (err) {
      this.setState({invalidInput: true})
    }
  }

  textInputChanged(textInput) {
    this.setState({textInput})
    console.log("Sending data to worker")
    coreWorker.loadData(textInput.data);
    console.log("Sending data DONE")
    this.search()
  }

  preprocessorsChanged(preprocessors) {
    preprocessors.forEach(p => p.className = p.name)
    coreWorker.setPreprocessors(preprocessors);
  }

  searchChanged(search) {
    this.setState({search}, () => this.search())
  }

  async downloadResults() {
    const data = await coreWorker.getFilteredData();
    const exportedData = data.map(({itemText}) => itemText);

    let fileName = `${this.state.textInput.name}-filtered.json`;

    downloadFile(JSON.stringify(exportedData, true, 4), fileName, 'text/plain');
  }

  drilldownAction(actionName, ... params) {
    coreWorker.drilldownAction(actionName, ... params);

    if(actionName === "addFilter" || actionName === "addExclusion") {
      this.setState({search: ""})
      setTimeout(() => this.search(), 20)
    }
  }

  render() {
    return (
      <div>
        <InputBar value={this.state.inputSettings}
                  onChange={this.textInputChanged.bind(this)}
                  onPreprocessorChange={this.preprocessorsChanged.bind(this)}/>
        <SearchBar value={this.state.search} onChange={this.searchChanged.bind(this)} onDrilldownAction={this.drilldownAction.bind(this)}/>
        <DrilldownFiltersBar drilldownSteps={this.state.drillDownSteps} onDrilldownAction={this.drilldownAction.bind(this)}/>
        <SearchResults progress={this.state.progress} res={this.state.results} onDownloadResults={this.downloadResults.bind(this)}/>
      </div>
    );
  }
}