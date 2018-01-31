import CoreWorker from "./core/CoreWorker"

const worker = new CoreWorker((...msg) => {
  console.log(msg);
}, (msg, payload) => {
  self.postMessage({msg, payload})
});

self.addEventListener('message', function({data}) {
  if (data.method) {
    worker[data.method](... (data.args))
  } else {
    console.error("Unknown message action", data);
  }
}, false);
