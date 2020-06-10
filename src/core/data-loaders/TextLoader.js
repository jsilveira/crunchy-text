export default class TextLoader {
  async loadData(data, metadata) {
    return {dataFormat: {type: 'text'}, data: data.split('\n')};
  }
}
