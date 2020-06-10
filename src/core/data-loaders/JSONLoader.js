import TextLoader from "./TextLoader";
import _ from 'lodash'

export default class JSONLoader extends TextLoader {
  async loadData(jsonString, metadata) {
    let dataRows = null;
    try {
      let data = JSON.parse(jsonString);
      if (_.isArray(data)) {
        dataRows = _.map(data, obj => _.isString(obj) ? obj : JSON.stringify(obj));
      } else {
        dataRows = JSON.stringify(data, true, 4).split('\n');
      }
      return {data: dataRows, dataFormat: {type: 'text'}};
    } catch(err) {
      return super.loadData(jsonString, metadata);
    }
  }
}
