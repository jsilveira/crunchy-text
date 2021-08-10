import _ from "../../lib/lodash.js";
import SearchableList from "./SearchableList.js";

export default class SearchableTextList extends SearchableList {
  constructor(rowsOfTabularData, dataFormat) {
    super(rowsOfTabularData, dataFormat);
  }

  preprocessParams(regex) {
    if(!regex) {
      regex = /.*/g;
    }
    return regex;
  }

  postProcessStats({topMatches}) {
    return {
      topMatches: _.mapValues(topMatches, groupTop => _.sortBy(_.toPairs(groupTop), "1").reverse())
    }
  }

  incrementalSearch(re, start, searchState, shouldPause) {
    const {matchesIndex, sampleMatches, stats} = searchState;

    stats.topMatches = stats.topMatches || {}
    let topMatches = stats.topMatches;

    for (let i = start; i < this.items.length; i++) {
      const item = this.items[i];
      debugger;
      const itemText = item.join('\t');
      // const itemText = item;

      let execRes = null;
      let matches = null;
      let lastIndex = null;
      //TODO: NOT FINISHED.
      // throw new Error("Not finished")
      while ((execRes = re.exec(itemText))) {
        // Prevent infinite loop if the regex does not consume characters
        if(execRes.index === lastIndex)
          break;

        for(let groupIndex = 0; groupIndex < execRes.length;groupIndex++) {
          let match = execRes[groupIndex] || "-";

          topMatches[groupIndex] = topMatches[groupIndex] || {};
          let matchCount = topMatches[groupIndex][match];
          if (!matchCount)
            searchState.uniqueCount++;
          topMatches[groupIndex][match] = (matchCount || 0) + 1;
        }
        (matches = matches || []).push(execRes)
        lastIndex = execRes.index;
      }

      if(matches) {
        matchesIndex.push(i);
        if (sampleMatches.length < 2000) {
          sampleMatches.push({item, matches});
        }
      }

      // Make periodical pauses to check search should not be cancelled
      // but check it only in some iterations for performance
      if (i % 1000 === 0 && shouldPause(i)) {
        return i;
      }
    }

    return this.items.length;
  }
}
