let singletonWorker = null;

export default class CoreWorkerProxy {
  constructor() {
    if(singletonWorker) {
      singletonWorker.terminate();
    }
    this.worker = new Worker('../worker.js');
    singletonWorker = this.worker;

    this.msgCbks = {}

    this.pendingCalls = {}

    // Test, used in all examples:
    this.worker.onmessage = ({data}) => {
      if(data.msg && this.msgCbks[data.msg]) {
        this.msgCbks[data.msg](data.payload)
      } else {
        console.warn(`Received unexpected msg from worker:`, data)
      }
    };

    this.onMsg('proxyCallResponse', ({callId, res}) => {
      if(callId && this.pendingCalls[callId]) {
        this.pendingCalls[callId](res);
      }
    })
    // this.worker.onerror(err => alert(err))
  }

  async proxyCall(method, ... args) {
    const callId = "call"+Math.random()+"-"+new Date()
    const responsePromise = new Promise((resolve, reject) => {
      this.pendingCalls[callId] = resolve;
    });
    this.worker.postMessage({method, args, callId})
    return responsePromise;
  }

  async loadData(data) {
    return await this.proxyCall('loadData', data)
  }

  async setPreprocessors(preprocessors) {
    return await this.proxyCall('setPreprocessors', preprocessors)
  }

  async search(searchObj) {
    return await this.proxyCall('search', searchObj)
  }

  async drilldownAction(... params) {
    return await this.proxyCall('drilldownAction', ... params)
  }

  async getFilteredData(... params) {
    return await this.proxyCall('getFilteredData', ... params)
  }

  onSearchDone(cbk) {
    this.onMsg('searchDone', cbk)
  }

  onLoadProgress(cbk) {
    this.onMsg('loadProgress',cbk)
  }

  onDrilldownStepsUpdate(cbk) {
    this.onMsg('drilldownStepsUpdate',cbk)
  }

  onMsg(msg, cbk) {
    this.msgCbks[msg] = cbk;
  }
}

async function fetchSample() {
  return await (await fetch(sampleURL)).json()
}
