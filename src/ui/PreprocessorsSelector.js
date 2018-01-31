import React, {Component} from 'react';

import RemoveSpecialChars from "../core/preprocessors/RemoveSpecialChars";
import RemoveStopWords from "../core/preprocessors/RemoveStopWords";

export default class PreprocessorsSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preprocessors: [
        new RemoveSpecialChars(),
        new RemoveStopWords()
      ]
    };
  }

  btnClick(preprocessor) {
    debugger;
    preprocessor.enabled = !preprocessor.enabled
    this.setState({preprocessors: this.state.preprocessors})
  }

  render() {
    let buttons = []
    this.state.preprocessors.forEach((pre, i) => buttons.push(
      <button type={"button"} key={i} className={'btn btn-sm ' + (pre.enabled ? 'btn-info' : 'btn-outline-secondary')}
            onClick={this.btnClick.bind(this, pre)}>
        {pre.name} {pre.enabled ? '(ON)' : '(OFF)'}
    </button>))

    return (
      <span style={{zoom: 0.8}}>
      {/*<span className={'text-info'}>Preprocessing:&nbsp;</span>*/}
      <span className="btn-group">
        {buttons}
      </span>
      </span>
    );
  }
}