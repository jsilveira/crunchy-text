import React, {Component} from 'react';

export default class PreprocessorsSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preprocessors: [
        //TODO: Until parcel fixes https://github.com/parcel-bundler/parcel/issues/758, we cannot
        // use the same class both here and the CoreWorker. So, a plain object is used
        {name: 'RemoveSpecialChars', enabled: true},
        {name: 'RemoveStopWords', enabled: true},
      ]
    };

    props.onChange(this.state.preprocessors)
  }

  btnClick(preprocessor) {
    preprocessor.enabled = !preprocessor.enabled
    this.setState({preprocessors: this.state.preprocessors})
    this.props.onChange(this.state.preprocessors)
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