import React, {Component} from 'react';


export default class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let searchRes = this.props.res || {};
    let items = (searchRes.filteredItems || []);
    let stats = (searchRes.stats || {});
    let searchTime = this.props.progress || stats.searchTime + "ms";

    const results = []
    items.slice(0, 50).forEach((res, i) => {
      results.push(<tr key={i} className={""}>
        <td> {res.toString()} </td>
      </tr>)
    });

    if (!items.length) {
      results.push(<tr key={-1} className={""}>
        <td><strong>No hay resultados</strong></td>
      </tr>)
    }

    return (
      <div className="container-fluid my-sm-2">
        <h5>{stats.matchesCount} matches <em className={"text-info"}>{searchTime}</em></h5>
        <div className={"row"}>
          <div className={"col-9"}>
            <table className={"ResultsTable"}>
              <tbody>
              {results}
              </tbody>
            </table>
          </div>
          <div className={"col-3"}>
            <TopMatches matches={(searchRes.extras || {}).topMatches || []}/>
          </div>
        </div>
      </div>
    );
  }
}


class TopMatches extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let items = (this.props.matches || []);

    const matches = []
    items.slice(0, 100).forEach((m, i) => {
      matches.push(<tr key={i} className={""}>
        <td> {m[0].toString()} </td>
        <td className={"text-info text-right"}> {m[1].toString()} </td>
      </tr>)
    });

    return (
      <div>
        <h5>Top matches count</h5>
            <table className={"TopMatchesTable"}>
              <tbody>
              {matches}
              </tbody>
            </table>
      </div>
    );
  }
}