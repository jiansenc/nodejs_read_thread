import { Worker, parentPort } from 'worker_threads'

import os from 'os'
const nameRegex = /'([\u4e00-\u9fa5]+)'/ // 匹配中文姓名
const phoneRegex = /N'(\d{11})'/ // 匹配手机号

// 创建多个数据库写入线程, 保留 2 个给 mongodb
// 控制CPU 使用数量
const cpulen = os.cpus().length - 5

const workerList = []
if (cpulen > 1) {
  for (var i = 0; i < cpulen; i++) {
    let wokerItem = new Worker('./insert.js')
    wokerItem.on('message', (msg) => {
      parentPort.postMessage(msg)
    })
    workerList.push(wokerItem)
  }
}

let count = 0
parentPort.on('message', (line) => {
  if (line.match(nameRegex) && line.match(phoneRegex)) {
    count++
    let name = line.match(nameRegex)[1]
    let phone = line.match(phoneRegex)[1]
    let address = line.split(`N'`)[6].replace(`')`, '')
    let tempobj = { name: name, phone: phone, address: address }
    let workerId = count % cpulen
    workerList[workerId].postMessage(tempobj)
  }
})
