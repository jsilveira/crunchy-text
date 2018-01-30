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
      search: '',
      results: [],
      inputSettings: null,
      status: "-",
      stats: {}
    };

    this.searchChanged = this.searchChanged.bind(this);
    this.textInputChanged = this.textInputChanged.bind(this);

    // fetchSample().then(async (json) => {
    coreWorker.loadData(sampleData);
    coreWorker.search()
    // })

    coreWorker.onLoadProgress(progress => this.setState({status: progress}))
    coreWorker.onSearchDone((results) => this.setState({results, stats: results.stats}))
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
    coreWorker.loadData(textInput);
    this.search()
  }

  searchChanged(search) {
    this.setState({ search }, () => this.search())
  }

  inputChanged(input) {
    this.textInputChanged(input.split('\n'))
  }

  render() {
    return (
      <div>
        <InputBar value={this.state.inputSettings} onChange={this.inputChanged.bind(this)} />
        <SearchBar value={this.state.search} onChange={this.searchChanged.bind(this)} />
        <div>{this.state.status}</div>
        <SearchResults res={this.state.results} />
      </div>
    );
  }
}