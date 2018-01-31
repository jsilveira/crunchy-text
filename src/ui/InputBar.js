import React, {Component} from 'react';
import FileDrop from 'react-file-drop'
import PreprocessorsSelector from "./PreprocessorsSelector";

// getJSON(url, sucessCbk, errCbk = ()=>console.error(err)) {
//   let request = new XMLHttpRequest();
//   request.open('GET', url, true);
//
//   request.onload = function () {
//     if (request.status >= 200 && request.status < 400) {
//       sucessCbk(JSON.parse(request.responseText));
//     } else {
//       errCbk("Error " + request.status)
//     }
//   };
//
//   request.onerror = function (err) {
//     errCbk(err)
//   };
//
//   request.send();
// }


// Sample data loaded
// parseDataObject(sampleData)

function nonCircularObjectToString(doc) {
  if (typeof doc === "object") {
    return _.map(_.values(doc), doc => this.nonCircularObjectToString(doc)).join(" ||| ")
  } else {
    return (doc || "").toString()
  }
}


class DataLoader {
  static loadFileData(file, data) {
    let fileName = file.name.toLowerCase();
    if (fileName.endsWith('.txt')) {
      return data.split('\n')
    } else if (fileName.endsWith('.json')) {
      return JSON.parse(data);
    } else {
      console.warn('Unsupported file format, treating as text')
      return data.split('\n')
    }
  }
}

export default class InputBar extends Component {
  constructor(props) {
    super(props);
    this.state = {currentInput: this.props.value};
  }

  // changes from the outside
  componentWillReceiveProps(nextProps) {
    const currentInput = nextProps.currentInput;
    if (this.state.currentInput != currentInput && currentInput) {
      this.setState({currentInput});
    }
  }

  handleFileDrop(files, event) {
    const file = files[0]

    this.setState({currentInput: {name: file.name, size: file.size}})

    const reader = new FileReader();

    function errorHandler(evt) {
      switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
          alert('File Not Found!');
          break;
        case evt.target.error.NOT_READABLE_ERR:
          alert('File is not readable');
          break;
        case evt.target.error.ABORT_ERR:
          break; // noop
        default:
          alert('An error occurred reading this file.');
      }
    }

    reader.onerror = errorHandler;
    reader.onprogress = ({lengthComputable, loaded, total}) => {
      // evt is an ProgressEvent.
      if (lengthComputable) {
        const percentLoaded = Math.round((loaded / total) * 100);
        if (percentLoaded < 100) {
          //angular.element($(".resultsarea")).scope().loadingFileProgress(`Loading ${percentLoaded}% (${file.name})`);
          console.log(`Loading ${percentLoaded}% (${file.name})`);
        }
      }
    };
    reader.onabort = (e) => alert('File read cancelled');
    reader.onloadstart = (e) => {};
    reader.onload = (e) => {
      // Ensure that the progress bar displays 100% at the end.
      // angular.element($(".resultsarea")).scope().loadingFileProgress(`Loading ${100}% (${file.name})`);

      console.log(`Loaded 100% (${file.name})`);

      if (this.props.onChange) {
        this.fileContent = reader.result;
        this.props.onChange(DataLoader.loadFileData(file, this.fileContent))
      }
    };
    // Read in the image file as a binary string.
    reader.readAsText(file);
  }

  preprocessorsChanged() {
    this.props.onChange(DataLoader.loadFileData(file, this.fileContent))
  }

  render() {
    let fileInfo = []
    let file = this.state.currentInput
    if (this.state.currentInput) {
      fileInfo = (<div>
        <strong>{file.name}</strong>
        &nbsp; {Math.ceil(file.size / (1024 * 1024) * 10) / 10} MB
      </div>)
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
            <PreprocessorsSelector onChange={this.preprocessorsChanged}/>
          </div>
        </div>
      </div>
    );
  }
}