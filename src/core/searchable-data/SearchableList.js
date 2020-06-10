import _ from "../../lib/lodash";

export default class SearchableList {
  constructor(itemsList, resultsFormat = {type: 'text'}) {
    this.searching = false;
    this.items = itemsList;
    this.resultsFormat = resultsFormat;
  }

  preprocessParams(searchParameters) {
    // Can be overriden by subclasses
    return searchParameters;
  }

  postProcessStats() {
    // Can be overriden by subclasses
    return {}
  }

  incrementalSearch() {
    throw new Error('Method incrementalSearch should be implemented by SearchableList subclasses')
  }

  search(searchParameters, sendProgress) {
    this.lastSearch = searchParameters;
    this.searching = true;
    this.progressSent = false;

    let params = this.preprocessParams(searchParameters);

    // Cancel any ongoing search
    clearTimeout(this.nextTick);

    if(this.items.length === 0) return;

    let searchId = new Date().valueOf();

    // Save the "current" search, on ignore any other previous partial or final result
    this.lastSearchId = searchId;

    const shouldPause = (lastIteration) => {
      let now = new Date();

      // Check if it is time to send partial results
      if (now - startTime > 35 && (!this.progressSent || now - this.lastProgressSent > 250)) {
        sendProgress('partialSearchResult', {
          matchSamples: searchState.sampleMatches.slice(0, 50),
          resultsFormat: this.resultsFormat,
          searchId: searchId,
          stats: {
            matchesCount: searchState.matchesIndex.length,
            totalCount: this.items.length
          }
        });
        this.lastProgressSent = now;
        this.progressSent = true;
      }

      // Every 50ms stop search to allow cancellation
      if (now - this.lastPause > 50) {
        this.lastPause = now;
        sendProgress("loadProgress", `Searching ${(lastIteration / this.items.length * 100).toFixed(0)}%`);
        return true;
      }
    };


    let startTime = new Date();

    this.lastPause = new Date();
    this.lastProgressSent = new Date();

    let searchState = {
      sampleMatches: [],
      matchesIndex: [],
      uniqueCount: 0,
      stats: {},
    };

    const resumeSearch = (startIndex) => {
      console.log(`Searching ${searchId} '${searchParameters}' from`, startIndex)
      let lastItemIndex = this.incrementalSearch(params, startIndex, searchState, shouldPause);

      if(lastItemIndex < this.items.length){
        this.nextTick = setTimeout(() => resumeSearch(lastItemIndex), 0);
      } else {
        // Post process search stats
        let otherStats = this.postProcessStats(searchState.stats);

        this.searching = false;
        const lastSearchTime = new Date().valueOf() - startTime;

        // TODO: Needed for download results. Stop doing this EVERY TIME
        // and only do it, searching again, if someone clicks export results
        // Then change `if (sampleMatches.length < 100000) {` to `< 2000`
        this.lastFilteredResults = searchState.sampleMatches;

        sendProgress('searchDone', {
          matchSamples: searchState.sampleMatches.slice(0, 2000),
          resultsFormat: this.resultsFormat,
          stats: {
            searchTime: lastSearchTime,
            matchesCount: searchState.matchesIndex.length,
            totalCount: this.items.length
          },
          extras: {
            ... otherStats,
            matchesCount: searchState.matchesIndex.length
          }
        });
      }
    };

    resumeSearch(0);
  }
}
