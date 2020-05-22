import React from "react";
import styles from "../../../public/stylesheets/search-results.less";

export class RegexSearchResult extends React.PureComponent {
  render() {
    const parts = []

    const {itemText, matches} = this.props.result;

    let from = 0;

    matches.forEach((m, i) => {
      parts.push(itemText.slice(from, m.index));
      let to = m.index + m[0].length;
      parts.push(<mark className={styles.markj} key={i}>{itemText.slice(m.index, to)}</mark>);
      from = to;
    })

    parts.push(itemText.slice(from));

    return (
      <div>{parts}</div>
    )
  }
}
