export default class InputPreprocessor {
  constructor(name) {
    this.name = name;
    this.enabled = true;
  }
  syncProcess(input) {
    throw "Must be implemented by subclasses"
  }
}