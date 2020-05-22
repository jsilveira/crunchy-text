import TextLoader from "./TextLoader";
import _ from 'lodash'

export default class CSVLoader extends TextLoader {
  async solveCSVFormat(data, metadata) {
    const {file} = metadata;

    return {
      delimiter: ',',
      comment: '',
      escape: '"',
      quote: '"'
    }
  }

  async loadData(data, metadata) {
    const {delimiter, comment, escape, quote} = await this.solveCSVFormat(data, metadata);

    return _.map(data.split('\n'), line => {
      let columns = line.split(delimiter);

      // TODO: Do properly, consider using or get inspiration from https://github.com/adaltas/node-csv-parse

      return columns;
    });
  }
}
