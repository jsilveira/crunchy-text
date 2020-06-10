import TextLoader from "./TextLoader";
import _ from 'lodash'

export default class CSVLoader extends TextLoader {
  async solveCSVFormat(data, metadata) {
    const {file} = metadata;

    // delimiter detection with a sample of data
    let possibleDelimiters = [',', '\t', ';'];
    const sampleRows = data.slice(0,10000).split('\n').slice(0,-1); // Ignore las row in case its truncated
    let delimiter = ',';
    let bestMatchCount = sampleRows.length;
    for(const del of possibleDelimiters) {
      const lengths = sampleRows.map(row => row.split(del).length);
      let differentColumnCountsWithDelimiter = _.uniq(lengths).length;
      if(differentColumnCountsWithDelimiter < bestMatchCount && lengths[0] > 1) {
        delimiter = del;
        bestMatchCount = differentColumnCountsWithDelimiter;
        if(bestMatchCount === 1) {
          break;
        }
      }
    }

    return {
      delimiter,
      comment: '',
      escape: '"',
      quote: '"'
    }
  }

  async loadData(data, metadata) {
    const {delimiter, comment, escape, quote} = await this.solveCSVFormat(data, metadata);
    console.time("cargando datita")

    // Max 100mb
    let stringRows = data.slice(0,100*1000*1000).split('\n');

    // const rows = new Array(stringRows.length);
    // let i = 0;
    // for(const line of stringRows) {
    //   // TODO: Do properly, consider using or get inspiration from https://github.com/adaltas/node-csv-parse
    //   // rows[i] = line.split(delimiter);
    //   rows[i] = [line]
    //   i++;
    // }
    console.timeEnd("cargando datita")
    return {data: stringRows, dataFormat: {type: 'tabularText', delimiter}}
  }
}
