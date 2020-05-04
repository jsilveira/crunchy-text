export class DataLoader {
  static loadFileData(file, data) {
    let fileName = file.name.toLowerCase();
    if (fileName.endsWith('.txt')) {
      return data.split('\n')
    } else if (fileName.endsWith('.json')) {
      return JSON.parse(data);
    } else {
      console.warn('Unsupported file format, treating as text')
      return data.split('\n')
    }
  }
}
