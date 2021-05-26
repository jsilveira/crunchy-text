import React, {Component} from 'react';
import downloadFile from "../../utils/downloadFile";
import _ from 'lodash';
import {RegexSearchResult} from "./RegexSearchResult";
import {TopMatches} from "./TopMatches";

import InfiniteScroll from 'react-infinite-scroller/index';

function getHtmlTableResultRow(collection) {
  let cols = [];

  for (let i = 0; i < collection.length; i++) {
    const col = collection[i];
    const hasLongWord = col.match(/\S{50,}/);
    let cssClass = hasLongWord ? 'withLongWords' : '';
    // cols.push(<td key={i} className={cssClass}>{col}</td>);
    cols.push(`<td class="${cssClass}">${col}</td>`);
  }
  cols = cols.join('');

  // return <tr className={""}>{cols}</tr>;
  return `<tr>${cols}</tr>`;
}

class SearchResultsTable extends React.PureComponent {
  buildResultsTable(searchRes, maxRows) {
    const {resultsFormat, matchSamples} = searchRes;
    const items = matchSamples || [];

    const results = []

    items.slice(0, maxRows).forEach((res, i) => {
      results.push(<tr key={i.toString() + searchRes.searchId} className={""}>
        <td className={'rowNumber'}>{i+1}</td>
        <td><RegexSearchResult result={res}/></td>
      </tr>)
    });

    if (!items.length) {
      results.push(<tr key={-1} className={""}>
        <td><strong>No hay resultados</strong></td>
      </tr>)
    }

    return <table className={'ResultsTable'}>
      <tbody>{results}</tbody>
    </table>
  }

  buildTabularResultsTable(searchRes, maxRows) {
    const {resultsFormat, matchSamples} = searchRes;
    const items = matchSamples || [];
    const results = []

    if(resultsFormat.type === 'tabularText' && resultsFormat.columns) {
      results.push(`<tr>${ _.map(resultsFormat.columns, (col,j) => `<th>${col}</th>`).join('') }</tr>`);
    }

    items.slice(0, maxRows).forEach((res, i) => {
      const {item, matches} = res;
      let cols = item;
      if (_.isString(cols)) {
        for (let j = matches.length - 1; j >= 0; j--) {
          const m = matches[j];
          if (m[0]) {
            cols = cols.slice(0, m.index) + `<mark class="markj">${m[0]}</mark>` + cols.slice(m.index + m[0].length);
          }
        }
        cols = cols.split(resultsFormat.delimiter);
      }
      if (cols.length) {
        results.push(getHtmlTableResultRow(cols));
      }
    });

    if (!items.length) {
      results.push(`<tr><td><strong>No hay resultados</strong></td></tr>`);
    }

    return <table className={'ResultsTable'}>
      <tbody dangerouslySetInnerHTML={{__html: results.join('')}}/>
    </table>
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(`%cResults render '${this.props.searchRes.searchId}' ${new Date() - this.startTime}ms`, 'color: blue')
  }

  render() {
    this.startTime = new Date();

    const {searchRes, maxRows} = this.props;
    const {resultsFormat} = searchRes;


    let table;
    if (resultsFormat.type === 'tabularText') {
      table = this.buildTabularResultsTable(searchRes, maxRows);
    } else {
      table = this.buildResultsTable(searchRes, maxRows);
    }

    return <div>
      {table}
    </div>;
  }
}

export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: '0',
      maxRows: 50
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(state.res !== props.res) {
      console.log("Resetie", props, state);
      return {
        maxRows: 50,
        res: props.res
      }
    }
    return null;
  }

  downloadUniqueMatches(matches) {
    downloadFile(JSON.stringify(matches, true, 4), 'unique-matches.json')
  }

  render() {
    const {selectedGroup, maxRows} = this.state;

    let searchRes = this.props.res;

    if (!searchRes) {
      if(this.props.progress) {
        return (<div className={"m-4 pt-4 text-secondary text-center"}>
          <h2 className="pt-4 text-center">{this.props.progress}</h2>
        </div>)
      } else {
        return (<div className={"m-4 pt-4 text-secondary text-center"}>
          <h2 className="pt-4 text-center">Drag and drop a data file here...</h2>
          <h3 className="pt-2 text-info ">.txt .csv .json .jsonl</h3>
        </div>)
      }
    }

    let items = (searchRes.matchSamples || []);
    let pagination = null;
    if (items.length > maxRows) {
      let message = `Show the other ${items.length - maxRows} rows...`;
      if (items.length > (maxRows + 500)) {
        message = `Show 500 more rows...`;
      }

      pagination = <div className={'text-center mt-2'}>
        <span className={'btn btn-primary'} onClick={() => this.setState({maxRows: maxRows + 500})}>{message}</span>
      </div>
    }

    const table = <InfiniteScroll
      pageStart={0}
      loadMore={() => this.setState({maxRows: maxRows + 50})}
      hasMore={items.length > maxRows}
      loader={<div className="loader" key={0}>Loading ...</div>}>
      <div>
        <SearchResultsTable searchRes={searchRes} maxRows={maxRows}/>
        {/*{pagination}*/}
      </div>
    </InfiniteScroll>;

    let stats = (searchRes.stats || {});
    let status = this.props.progress || <span>Searched {stats.totalCount.toLocaleString()} items in <span className={'text-info'}>{stats.searchTime}ms</span></span>;

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
          <span className='zoom-small btn btn-sm btn-link ms-1 p-0'
                onClick={() => this.downloadUniqueMatches(top.map(t => t[0]))}
                title={`Download ${top.length} unique matches as json`}>
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

    let result = <div className="">
      <div className={"row"}>
        <div className={"col-9 py-3"} style={{overflow: 'auto'}}>
          <div className={"d-flex justify-content-between"}>
            <div className={""}>
              <h5 className={''}>
                {(stats.matchesCount || 0).toLocaleString()} matches &nbsp;
                <span className={"text-black-50 fw-light small"}>{status}</span>
              </h5>
            </div>
            <div className={"text-end zoom-small"}>
               <span className='btn btn-sm btn-link' onClick={this.props.onDownloadResults}
                     title={`Download ${stats.matchesCount} results as json`}>
                 <i className="material-icons align-middle">file_download</i>
                </span>
            </div>
          </div>
          {table}
        </div>
        <div className={"col-3 p-3"}>{extras}</div>
      </div>
    </div>;

    return result;
  }
}


