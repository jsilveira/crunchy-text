import React, { Component } from 'react';
import { render } from 'react-dom';

import CrunchyText from './ui/CrunchyText.jsx';


class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <CrunchyText />
    );
  }
}

render(<App />, document.getElementById('root'));
