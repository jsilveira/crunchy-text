import CoreWorker from "./core/CoreWorker.js"

const worker = new CoreWorker((...msg) => {
  console.log(msg);
}, (msg, payload) => {
  self.postMessage({msg, payload})
});

self.addEventListener('message', async function({data}) {
  if (data.method) {
    let res = await worker[data.method](... (data.args))
    self.postMessage({msg: 'proxyCallResponse', payload: {callId: data.callId, res}});
  } else {
    console.error("Unknown message action", data);
  }
}, false);
