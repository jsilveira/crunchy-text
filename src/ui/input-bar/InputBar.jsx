import React, {Component} from 'react';
import FileDrop from 'react-file-drop'
import PreprocessorsSelector from "./PreprocessorsSelector";
import "../../../public/stylesheets/file-drop.css"

export default class InputBar extends Component {
  constructor(props) {
    super(props);
    // this.state = {currentInput: this.props.value};
  }

  // // changes from the outside
  // componentWillReceiveProps(nextProps) {
  //   const currentInput = nextProps.currentInput;
  //   if (this.state.currentInput != currentInput && currentInput) {
  //     this.setState({currentInput});
  //   }
  // }

  handleFileDrop(files) {
    const file = files[0]

    if (!file) {
      return;
    }

    this.props.onChange({name: file.name, file})
  }

  preprocessorsChanged(preprocessors) {
    this.props.onPreprocessorChange(preprocessors)
  }

  render() {
    let {value: {name, file}} = this.props

    let fileInfo;
    if (file) {
      fileInfo = <div>
        <strong>{file.name}</strong>
        &nbsp; {Math.ceil(file.size / (1024 * 1024) * 10) / 10} MB
      </div>
    } else {
      fileInfo = "Drag and drop a text/json/csv file here"
    }

    return (
      <div className={'container-fluid bg-dark '}>
        <div className={'row align-items-center pt-2'}>
          <div className="col-md-6 text-white text-center">
            {fileInfo}
            <FileDrop frame={document} onDrop={this.handleFileDrop.bind(this)}>
              <div className="" id="navbarSupportedContent">
                Drag your file here
              </div>
            </FileDrop>
          </div>
          <div className={'col-md-6 text-right'}>
            <PreprocessorsSelector onChange={this.preprocessorsChanged.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}
