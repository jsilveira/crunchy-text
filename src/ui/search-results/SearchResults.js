import React, {Component} from 'react';
import downloadFile from "../../utils/downloadFile";
import styles from "../../../public/stylesheets/search-results.less"
import _ from 'lodash';
import {RegexSearchResult} from "./RegexSearchResult";
import {TopMatches} from "./TopMatches";

export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: '0',
    }
  }

  downloadUniqueMatches(matches) {
    downloadFile(JSON.stringify(matches, true, 4), 'unique-matches.json')
  }

  render() {
    const {selectedGroup} = this.state;

    let startTime = new Date();
    let searchRes = this.props.res;

    if(!searchRes)  {
      return (<div className={"m-3"}><h5 className="pl-2">No data has been loaded yet</h5></div>)
    }

    let items = (searchRes.matchSamples || []);
    let stats = (searchRes.stats || {});
    let status = this.props.progress || `Searched ${stats.totalCount.toLocaleString()} items in ${stats.searchTime}ms`;

    const results = []
    items.slice(0, 50).forEach((res, i) => {
      results.push(<tr key={i.toString()+searchRes.searchId} className={""}>
        <td> <RegexSearchResult result={res}/></td>
      </tr>)
    });

    if (!items.length) {
      results.push(<tr key={-1} className={""}>
        <td><strong>No hay resultados</strong></td>
      </tr>)
    }

    const extras = [];

    if (searchRes.extras) {
      let max = 50;

      let {topMatches, matchesCount} = (searchRes.extras || {});

      let top = topMatches[this.state.selectedGroup] || topMatches[0];

      if (top) {
        if (_.keys(topMatches).length > 1) {
          extras.push(<ul key={'groups'} className={'nav nav-tabs mb-2'}>
            {
              _.map(topMatches, (tops, groupNumber) => <li key={groupNumber} className={'nav-item'}>
                <a
                   href={'javascript:void(0)'}
                   className={`nav-link px-2 ${groupNumber === selectedGroup ? 'active' : ''}`}
                   onClick={() => this.setState({selectedGroup: groupNumber})}>
                  {groupNumber == '0' ? 'All' : `(# ${groupNumber})`}
                </a>
              </li>)
            }
          </ul>)
        }

        extras.push(<h5 key={'title'}>
          Unique matches: {top.length.toLocaleString()}&nbsp;
          <span className='zoom-small btn btn-sm btn-link ml-1 p-0' onClick={() => this.downloadUniqueMatches(top.map(t => t[0]))} title={`Download ${top.length} unique matches as json`}>
             <i className="material-icons align-middle">file_download</i>
          </span>
        </h5>)


        extras.push(<TopMatches key={'top'} title={`Top ${Math.min(max, top.length)} matches`}
                                totalCount={matchesCount}
                                matches={top.slice(0, max)}/>)
        if (top.length > max) {
          extras.push(<hr key={'hr'}/>)

          extras.push(< TopMatches key={'bottom'} title={`Bottom ${max} matches`}
                                   totalCount={matchesCount}
                                   matches={top.slice(-Math.min(top.length - max, max))}/>)
        }
      }
    }

    // console.log("Render time", new Date() - startTime)

    return (
      <div className="container-fluid">
        <div className={"row"}>
          <div className={"col-9 p-3"}>
            <div className={"row"}>
              <div className={"col-9 p-0 pl-3"}>
                <h5 className={'pl-2'}>
                  {stats.matchesCount.toLocaleString()} matches &nbsp;
                  <em className={"text-info small"}>{status}</em>
                </h5>
              </div>
              <div className={"col-3 p-0 text-right zoom-small"}>
               <span className='btn btn-sm btn-link' onClick={this.props.onDownloadResults} title={`Download ${stats.matchesCount} results as json`}>
                 <i className="material-icons align-middle">file_download</i>
                </span>
              </div>
            </div>
            <table className={styles.ResultsTable}>
              <tbody>
              {results}
              </tbody>
            </table>
          </div>
          <div className={"col-3 bg-light p-3"}>{extras}</div>
        </div>
      </div>
    );
  }
}


