import React, {Component} from 'react';
import downloadFile from "../utils/downloadFile";

export default class SearchResults extends Component {
  downloadUniqueMatches(matches) {
    downloadFile(JSON.stringify(matches, true, 4), 'unique-matches.json')
  }

  render() {
    let searchRes = this.props.res;

    if(!searchRes)  {
      return (<div className={"m-3"}><h5>No data has been loaded yet</h5></div>)
    }

    let items = (searchRes.matchSamples || []);
    let stats = (searchRes.stats || {});
    let status = this.props.progress || `Searched ${stats.totalCount.toLocaleString()} items in ${stats.searchTime}ms`;

    const results = []
    items.slice(0, 50).forEach((res, i) => {
      results.push(<tr key={i} className={""}>
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
      let top = (searchRes.extras || {}).topMatches;
      if (top) {
        extras.push(<h5 key={'title'}>
          Unique matches: {top.length.toLocaleString()}&nbsp;
          <span className='zoom-small btn btn-sm btn-link' onClick={() => this.downloadUniqueMatches(top.map(t => t[0]))} title={`Download ${top.length} unique matches as json`}>
             <i className="material-icons align-middle">file_download</i>
          </span>
        </h5>)
        extras.push(<TopMatches key={'top'} title={`Top ${Math.min(max, top.length)} matches`} matches={top.slice(0, max)}/>)
        if (top.length > max) {
          extras.push(<hr key={'hr'}/>)
          extras.push(< TopMatches key={'bottom'} title={`Bottom ${max} matches`}
                                   matches={top.slice(-Math.min(top.length - max, max))}/>)
        }
      }
    }

    return (
      <div className="container-fluid">
        <div className={"row"}>
          <div className={"col-9 p-4"}>
            <div className={"row"}>
              <div className={"col-9 p-0 pl-3"}>
                <h5>
                  {stats.matchesCount.toLocaleString()} matches &nbsp;
                  <em className={"text-info"}>{status}</em>
                </h5>
              </div>
              <div className={"col-3 p-0 text-right zoom-small"}>
               <span className='btn btn-sm btn-link' onClick={this.props.onDownloadResults} title={`Download ${stats.matchesCount} results as json`}>
                 <i className="material-icons align-middle">file_download</i>
                </span>
              </div>
            </div>
            <table className={"ResultsTable"}>
              <tbody>
              {results}
              </tbody>
            </table>
          </div>
          <div className={"col-3 bg-light p-4"}>{extras}</div>
        </div>
      </div>
    );
  }
}

class RegexSearchResult extends Component {
  render() {
    const parts = []
    const {itemText, matches} = this.props.result;
    let from = 0;
    // debugger;
    matches.forEach((m, i) => {
      parts.push(itemText.slice(from, m.index));
      let to = m.index+m[0].length;
      parts.push(<mark key={i}>{itemText.slice(m.index,to)}</mark>);
      from = to;
    })
    parts.push(itemText.slice(from));

    return (
      <div>{ parts }</div>
    )
  }
}


class TopMatches extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let items = (this.props.matches || []);

    const matches = []
    items.slice(0, 100).forEach(([uniqueMatch, count], i) => {
      matches.push(<tr key={i} className={""}>
        <td className={"text-info text-right"}> {count.toString()} </td>
        <td>{uniqueMatch.toString()} </td>
      </tr>)
    });

    return (
      <div>
        <h6>{this.props.title}</h6>
        <table className={"TopMatchesTable"}>
          <tbody>
          {matches}
          </tbody>
        </table>
      </div>
    );
  }
}