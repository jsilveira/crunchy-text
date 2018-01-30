import React, { Component } from 'react';

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let searchRes = this.props.res || {};
    let items = (searchRes.filteredItems || []);
    let searchTime = (searchRes.stats ||{}).searchTime;

    const results = []
    items.slice(0,20).forEach((res, i) => {
      results.push(<tr key={i}  className={""}><td> { res.toString() } </td></tr>)
    });
    
    if (!items.length) {
      results.push(<tr key={-1} className={""}><td><strong>No hay resultados</strong></td></tr>)
    }

    return (
      <div className="container-fluid">
        <h5>{ items.length } matches <em className={"text-info"}>{searchTime}ms</em></h5>
        <table className={"ResultsTable"}><tbody>
      { results }
        </tbody>
        </table>
      </div>
    );
  }
}