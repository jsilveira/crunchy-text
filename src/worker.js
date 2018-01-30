import CoreWorker from "./core/CoreWorker"

const worker = new CoreWorker((...msg) => {
  console.log(...msg);
}, (msg, payload) => {
  self.postMessage({msg, payload})
});

self.addEventListener('message', function({data}) {
  if (data.method) {
    worker[data.method](...data.args)
  } else {
    console.error("Unknown message action", data);
  }

  /*  case 'search':
      search(new RegExp(msg.data.query, "ig"));
      break;
    case 'loadFile':
      try {
        const fileName = msg.data.fileName.toLowerCase().trim()
        if(fileName.endsWith(".json")) {
          log("Parsing file as JSON...")
          parseDataObject(JSON.parse(msg.data.fileText))
        } else {
          log("Parsing file line by line")
          parseDataObject(msg.data.fileText.split("\n"))
        }
      } catch (err){
        log("Error loading file: "+err)
      }
      break;
    default:
  }*/
}, false);
