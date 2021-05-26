import React, {Component} from 'react';

export default class PreprocessorsSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preprocessors: [
        //TODO: Until parcel fixes https://github.com/parcel-bundler/parcel/issues/758, we cannot
        // use the same class both here and the CoreWorker. So, a plain object is used
        {name: 'RemoveSpecialChars', enabled: false},
        {name: 'RemoveStopWords', enabled: false},
      ]
    };

    if(this.state.preprocessors) {
      props.onChange(this.state.preprocessors)
    }
  }

  btnClick(preprocessor) {
    preprocessor.enabled = !preprocessor.enabled
    this.setState({preprocessors: this.state.preprocessors})
    this.props.onChange(this.state.preprocessors)
  }

  render() {
    let buttons = []
    this.state.preprocessors.forEach((pre, i) => buttons.push(
      <div className="form-check form-switch ms-3 fw-light"   key={pre.name}>
        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={pre.enabled ? true : false} onChange={this.btnClick.bind(this, pre)}/>
          <label className={`form-check-label small text-${pre.enabled ? 'light' : 'white-50' }`} htmlFor="flexSwitchCheckDefault">
            {pre.name}
          </label>
      </div>));

    return <span style={{}} className={'align-middle'}>
    <span className={'text-white fw-light'}>Postprocessing:&nbsp;</span>
    <span className="btn-group">
      {buttons}
    </span>
    </span>;
  }
}
