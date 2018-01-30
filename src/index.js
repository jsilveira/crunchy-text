import React, { Component } from 'react';
import { render } from 'react-dom';

import TextFlow from './ui/TextFlow.js';


class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <TextFlow />
    );
  }
}

render(<App />, document.getElementById('root'));
