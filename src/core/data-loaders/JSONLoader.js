import TextLoader from "./TextLoader";

export default class JSONLoader extends TextLoader {
  async loadData(data, metadata) {
    return JSON.parse(data);
  }
}
