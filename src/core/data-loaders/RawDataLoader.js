import CSVLoader from "./CSVLoader";
import TextLoader from "./TextLoader";
import JSONLoader from "./JSONLoader";

export class RawDataLoader {
  static async loadFileData(file, data) {

    const loaders = {
      'txt': TextLoader,
      'csv': CSVLoader,
      'json': JSONLoader
    };

    let fileName = file.name.toLowerCase();

    let extension = fileName.split('.').slice(-1)[0];

    let loaderClass = loaders[extension];
    if (!loaderClass) {
      console.warn('Unsupported file format, treating as plain text')
      loaderClass = TextLoader
    }

    let loader = new loaderClass();

    return loader.loadData(data, {file})
  }
}
