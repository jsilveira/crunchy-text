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


export default class CrunchyText extends Component {
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
    this.inputDataChanged = this.inputDataChanged.bind(this);

    this.coreWorker = new CoreWorkerProxy();
    this.coreWorker.loadData(sampleData);
    setTimeout(() => {
      this.search();
    }, 20)

    this.coreWorker.onLoadProgress(progress => this.setState({progress}))
    this.coreWorker.onSearchDone(results => this.setState({results, stats: results.stats, progress: ""}))
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

  inputDataChanged(textInput) {
    this.setState({textInput, progress: "Sending data to worker..."})

    // Set timeout to ensure progress is show
    setTimeout(() => {
      this.coreWorker.loadData(textInput.data)
      this.search()
    }, 1)
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

    let fileName = `${this.state.textInput.name}-filtered.json`;

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
        <InputBar value={inputSettings}
                  onChange={this.inputDataChanged.bind(this)}
                  onInputProgress={this.onInputProgress.bind(this)}
                  onPreprocessorChange={this.preprocessorsChanged.bind(this)}/>

        <SearchBar value={search} onChange={this.searchChanged.bind(this)} onDrilldownAction={this.drilldownAction.bind(this)}/>

        <DrilldownFiltersBar drilldownSteps={drillDownSteps} onDrilldownAction={this.drilldownAction.bind(this)}/>

        <SearchResults progress={progress} res={results} onDownloadResults={this.downloadResults.bind(this)}/>
      </div>
    );
  }
}
