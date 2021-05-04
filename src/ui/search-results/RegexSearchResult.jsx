import React from "react";
import styles from "../../../public/stylesheets/search-results.module.scss";

export class RegexSearchResult extends React.PureComponent {
  render() {
    const parts = []

    const {item, matches} = this.props.result;

    let from = 0;

    matches.forEach((m, i) => {
      parts.push(item.slice(from, m.index));
      let to = m.index + m[0].length;
      parts.push(<mark className={styles.markj} key={i}>{item.slice(m.index, to)}</mark>);
      from = to;
    })

    parts.push(item.slice(from));

    return (
      <div>{parts}</div>
    )
  }
}
