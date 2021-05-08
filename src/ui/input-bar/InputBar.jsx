import React, {Component} from 'react';
import _ from 'lodash';

import FileDrop from '../../lib/FileDropUPDATED'
// import FileDrop from 'react-file-drop'
import PreprocessorsSelector from "./PreprocessorsSelector";
import "../../../public/stylesheets/file-drop.css"
import {get, set} from "https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";
import Icon from "../common/Icon";

export default class InputBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    get("lastFiles").then(files => {
      this.setState({lastFiles: files || []});
    });
  }

  // // changes from the outside
  // componentWillReceiveProps(nextProps) {
  //   const currentInput = nextProps.currentInput;
  //   if (this.state.currentInput != currentInput && currentInput) {
  //     this.setState({currentInput});
  //   }
  // }

  async handleFileDrop(files) {
    const droppedFile = files[0]

    if (!droppedFile || !droppedFile.kind === 'file') {
      return;
    }

    const entry = await droppedFile.getAsFileSystemHandle();

    await this.loadFromFileHandle(entry);
  }

  preprocessorsChanged(preprocessors) {
    this.props.onPreprocessorChange(preprocessors)
  }

  async loadFile() {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      this.loadFromFileHandle(fileHandle);
    } catch (error) {
      if(error.name !== 'AbortError' && error.code != 20) {
        alert(error.name, error.message);
      }
    }
  }

  async loadFromFileHandle(fileHandle) {
    if (await this.verifyPermission(fileHandle)) {
      const file = await fileHandle.getFile();

      let lastFiles = this.state.lastFiles;

      let repeated = false;
      for(let i = 0;i<lastFiles.length;i++) {
        let h = lastFiles[i];
        if(h === fileHandle || await h.isSameEntry(fileHandle)) {
          repeated = true;
          lastFiles[i] = fileHandle;
          break;
        }
      }
      if(!repeated) {
        lastFiles = [fileHandle, ... lastFiles];
      }
      await set("lastFiles", lastFiles);
      this.setState({lastFiles: lastFiles, currentFileHandle: fileHandle, currentFile: file})

      const contents = await file.text();

      this.props.onChange({name: file.name, file});
    }
  }

  async reloadFile(fileHandleOrUndefined) {
    if (fileHandleOrUndefined) {
      console.logTime(`Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`);
      await this.loadFromFileHandle(fileHandleOrUndefined);
    }
  }

  async verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  render() {
    let {value} = this.props

    let currentFileName, currentFileSize;
    if (this.state.currentFile) {
      let {name, size} = this.state.currentFile;
      currentFileName = <span className={'align-self-end rounded-top px-3 py-1 me-2 bg-dark'}>
        <span>{name}</span>
      </span>

      currentFileSize = <span className={'me-2 badge bg-warning text-dark'}>{Math.ceil(size / (1024 * 1024) * 10) / 10} MB</span>
    }

    let dragOther = <div className={'text-dark d-inline-block text-center my-2'}>
      Drag & drop a <strong>text/json/csv</strong> here or <a href={''} className={''} onClick={(e) => e.preventDefault() + this.loadFile()}>
      open a file
    </a>
    </div>

    let recentFilesBtns = null;
    if (this.state.lastFiles?.length) {
      recentFilesBtns = _.without(this.state.lastFiles, this.state.currentFileHandle).slice(0,4).map(handle => <span key={handle.name}
        className={'btn btn-sm btn-outline-dark border-bottom-0 align-self-end rounded-0 rounded-top py-0 pt-1 pb-1'}
        onClick={() => this.reloadFile(handle)}>
        <Icon icon={'undo'}/>
        <span className={'ms-1 small'}>{handle.name}</span>
    </span>);
    }

    return <div className={'row'}>
      <div className={'d-flex justify-content-between align-items-center px-4'}>
        <div className="d-flex align-self-end align-items-center text-white mt-2">
          {currentFileName}

          {recentFilesBtns}


          <FileDrop frame={document} onDrop={this.handleFileDrop.bind(this)}>
            <div className="" id="navbarSupportedContent">
              Drag your file here
            </div>
          </FileDrop>
        </div>

        {dragOther}
        <div></div>
      </div>

      <div className={'d-flex justify-content-between  bg-dark pb-1 pt-2  px-4 border-secondary border-bottom'}>
        <div>
          {currentFileSize}
        </div>
        <PreprocessorsSelector onChange={this.preprocessorsChanged.bind(this)}/>
      </div>

    </div>;
  }
}
