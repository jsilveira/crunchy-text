import React, {Component} from 'react';
import _ from 'lodash';

import FileDrop from '../../lib/FileDropUPDATED'
import PreprocessorsSelector from "./PreprocessorsSelector";
import "../../../public/stylesheets/file-drop.css"
import {get, set} from "https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";
import Icon from "../common/Icon";

function Tab({name, icon, selected, onClick, onSecondaryClick}) {
  let style = selected ? 'btn-dark': 'btn-outline-dark';

  const fixTabDoubleBorder = {marginRight: '-1px'};

  return <span style={fixTabDoubleBorder} className={`btn btn-sm ${style} border-bottom-0 align-self-end rounded-0 rounded-top py-1 d-flex align-items-center`}>
              <Icon icon={icon}/>

              <span onClick={onClick || (() => true)}>
                  <span className={"ms-1 me-1 small"}>{name}</span>
              </span>

              <Icon small icon={"close"} level={"secondary"} onClick={onSecondaryClick}/>
  </span>;
}

export default class InputBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    get("lastFiles").then(files => {
      this.setState({lastFiles: _.compact(files) || []});
    });
  }

  // // changes from the outside
  // componentWillReceiveProps(nextProps) {
  //   const currentInput = nextProps.currentInput;
  //   if (this.state.currentInput != currentInput && currentInput) {
  //     this.setState({currentInput});
  //   }
  // }

  async handleFileDrop(dataTransferItems) {
    let files = Array.from(dataTransferItems);

    if (!files.length || !files[0].kind === 'file') {
      return;
    }

    // const entry = await droppedFile.getAsFileSystemHandle();

    let handles = await Promise.all(_.map(files, file => file.getAsFileSystemHandle()));

    for(const handle of handles.slice(1)) {
      await this.updateLastFiles(handle);
    }

    await this.loadFromFileHandle(handles[0]);
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

  async updateLastFiles(fileHandle) {
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
    console.log("Setting lastFiles")

    this.setState({lastFiles: lastFiles})
  }

  async loadFromFileHandle(fileHandle) {
    if (await this.verifyPermission(fileHandle)) {
      const file = await fileHandle.getFile();

      await this.updateLastFiles(fileHandle);

      this.setState({currentFileHandle: fileHandle, currentFile: file})

      // const contents = await file.text();

      this.props.onChange({name: file.name, file});
    }
  }

  async reloadFile(fileHandleOrUndefined) {
    if (fileHandleOrUndefined) {
      console.logTime(`Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`);
      await this.loadFromFileHandle(fileHandleOrUndefined);
    }
  }

  async removeFileFromHistory(fileHandle) {
    const lastFiles = _.without(this.state.lastFiles, fileHandle);
    await set("lastFiles", lastFiles);
    this.setState({lastFiles: lastFiles})
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

    const {lastFiles, currentFile, currentFileHandle} = this.state;

    let dragOther = <div className={'text-dark d-inline-block text-center my-2'}>
      Drag a <strong>text/json/csv</strong> here or <a href={''} className={''} onClick={(e) => e.preventDefault() + this.loadFile()}>
      open a file
    </a>
    </div>

    let currentFileSize, fileTabs, moreFilesBtn;

    if (lastFiles?.length) {
      // let recent = _.without(this.state.lastFiles, this.state.currentFileHandle);
      let recent = lastFiles.slice(0,5);

      if(currentFileHandle && !_.includes(recent, currentFileHandle)) {
        recent = [currentFileHandle, ... recent.slice(0,4)]
      }

      fileTabs = recent.map(handle => {
        if (handle === currentFileHandle && currentFile) {
          let {name, size} = currentFile;

          currentFileSize = <span className={'me-2 badge bg-warning text-dark'}>{Math.ceil(currentFile.size / (1024 * 1024) * 10) / 10} MB</span>

          return <Tab icon={'article'} key={handle.name} selected name={handle.name}
                      onSecondaryClick={(e) => this.removeFileFromHistory(handle) + this.setState({currentFile: null, currentFileHandle: null})}/>;
        }

        return <Tab icon={'undo'} key={handle.name} name={handle.name} onClick={() => this.reloadFile(handle)}
                    onSecondaryClick={(e) => this.removeFileFromHistory(handle) + e.preventDefault()}/>;
      });

      if(recent.length > 4) {
        moreFilesBtn = <span className={'btn pb-1'} title={'See and edit recent files history...'}>
          <Icon large icon={'history'} level={'black-50'} onClick={(e) => this.openHistory()}/>
        </span>
      }
    }

    return <div className={'row'}>
      <div className={'d-flex justify-content-between align-items-center px-4'}>
        <div className="d-flex align-self-end align-items-center text-white mt-2">
          {fileTabs}

          { moreFilesBtn }

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
