export default class InputPreprocessor {
  constructor(name, config) {
    this.name = name;
    this.config = { ... config};
  }

  syncProcess(input) {
    throw "Must be implemented by subclasses"
  }
}