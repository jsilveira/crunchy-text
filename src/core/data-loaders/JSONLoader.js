import TextLoader from "./TextLoader";
import _ from '../../lib/lodash'

export default class JSONLoader extends TextLoader {
  samplePossibleColumns(arrayOfObjects) {
    let counts = {};
    let stringCount = 0;
    let sample = arrayOfObjects.slice(0, 50);
    for (const obj of sample) {
      if (_.isString(obj)) {
        stringCount++;
      } else {
        _.each(obj, (v, k) => counts[k] = (counts[k] || 0) + 1);
      }
    }
    if (stringCount === 0) {
      let pairs = _.toPairs(counts);
      let repeatedObjectFields = _.filter(pairs, ([key, count]) => (count / sample.length) > 0.3);
      if (repeatedObjectFields.length / pairs.length > 0.6) {
        return _.map(pairs, '0');
      }
    } else {
      return false;
    }
  }

  async loadData(jsonString, metadata) {
    const columnsWhitelist = ['full_name', 'career_experience', 'summary', 'search_reason', 'linkedin_handle', 'screen_notes', 'english_level', 'education_degree', 'current_studies', 'education_year', 'short_roles', 'github_url', 'twitter_url', 'website_url', 'blog_url', 'base_salary', '', '', '', '', ''];

    let dataRows = null;
    try {
      let data = JSON.parse(jsonString);
      if (_.isArray(data)) {
        let columns = this.samplePossibleColumns(data);

        columns = columnsWhitelist;

        if (columns) {
          dataRows = _.map(data, obj => {
            let values = [];
            for(const col of columns) {
              const val = (obj || {})[col] || '';
              let stringVal = _.isString(val) ? val : JSON.stringify(val);
              // Ensure csv format is not broken by a content tab character
              values.push(stringVal.replace(/\t/g, '\\t'));
            }

            return values.join('\t');
          });

          return {data: dataRows, dataFormat: {type: 'tabularText', delimiter: '\t', columns}}
        } else {
          dataRows = _.map(data, obj => {
            return _.isString(obj) ? obj : JSON.stringify(obj);
          });
        }
      } else {
        dataRows = JSON.stringify(data, true, 4).split('\n');
      }
      return {data: dataRows, dataFormat: {type: 'text'}};
    } catch (err) {
      return super.loadData(jsonString, metadata);
    }
  }
}
