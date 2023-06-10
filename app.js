import fs from 'fs'
import readline from 'readline'
import { Worker, isMainThread, parentPort } from 'worker_threads'
import store from './store.js'

// 读取文件路径
const filePath = 'E:/shunfeng/script.sql'
// 是否暂停
const parseWork = new Worker('./ps.js')
store.setValue('isPsuspend', false)

parseWork.on('message', (msg) => {
  console.log('收到总线请求,', msg)
  if (msg === 'stop') {
    rl.pause()
    store.setValue('isPsuspend', true)
  }
  if (msg === 'start') {
    rl.resume()
    store.setValue('isPsuspend', false)
  }
})
const rl = readline.createInterface({
  input: fs.createReadStream(filePath, {
    highWaterMark: 1024,
    encoding: 'utf16le'
  }),
  crlfDelay: Infinity
})

rl.on('line', function (line) {
  parseWork.postMessage(line)
})

rl.on('close', function () {
  console.log('结束')
  client.close()
})
