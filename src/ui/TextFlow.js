import React, { Component } from 'react';

import InputBar from './InputBar.js';
import SearchBar from './SearchBar.js';
import SearchResults from './SearchResults.js';
import CoreWorkerProxy from "../core/CoreWorkerProxy";

//const sampleURL = 'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json';
const sampleData = require('../../public/samples/sample-data.json');

async function fetchSample() {
  return await (await fetch(sampleURL)).json()
}

const coreWorker = new CoreWorkerProxy();

export default class TextFlow extends Component {
  constructor() {
    super();
    this.state = {
      textInput: [],
      search: 'de \\w+',
      results: null,
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
  }

  search() {
    try {
      coreWorker.search(new RegExp(this.state.search, 'ig'));
    } catch(err) {
      this.setState({invalidInput: true})
    }
  }

  textInputChanged(textInput) {
    this.setState({ textInput })
    console.log("Sending data to worker")
    coreWorker.loadData(textInput);
    console.log("Sending data DONE")
    this.search()
  }

  searchChanged(search) {
    this.setState({ search }, () => this.search())
  }

  render() {
    return (
      <div>
        <InputBar value={this.state.inputSettings} onChange={this.textInputChanged.bind(this)} />
        <SearchBar value={this.state.search} onChange={this.searchChanged.bind(this)} />
        <SearchResults progress={this.state.progress} res={this.state.results} />
      </div>
    );
  }
}