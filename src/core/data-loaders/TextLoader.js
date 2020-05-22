export default class TextLoader {
  async loadData(data, metadata) {
    return data.split('\n');
  }
}
