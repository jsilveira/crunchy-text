import React, {Component} from "react";

export class TopMatches extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {matches, totalCount} = this.props;
    let items = (matches || []);

    const rows = []
    items.slice(0, 100).forEach(([uniqueMatch, count], i) => {
      rows.push(<tr key={i} className={""}>
        <td><div className={"text-info text-end pe-3"}> {count.toString()}</div> </td>
        <td>{uniqueMatch.toString()} </td>
        <td className={'small text-secondary text-end ps-2'}>{((count / totalCount * 100)).toFixed(1)}%</td>
      </tr>)
    });

    return (
      <div>
        <h6>{this.props.title}</h6>
        <table className={'TopMatchesTable'}>
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
    );
  }
}
