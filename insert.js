import { Worker, parentPort } from 'worker_threads'
import { MongoClient } from 'mongodb'
import store from './store.js'

const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

// Database Name
const dbName = 'sfdb'
await client.connect()
const db = client.db(dbName)
const collection = db.collection('sfdb')
let list = []

//加入队列
parentPort.on('message', (data) => {
  list.push(data)
})

const spnum = 10000
const maxlen = spnum * 30
let handNum = 0
// 每秒从队列取出数据 ，如果溢出暂停文件读取,等待队列数据处理完恢复
setInterval(() => {
  let pushitem = list.splice(0, spnum)
  collection.insertMany(pushitem)
  let isPsuspend = store.getValue('isPsuspend')
  if (isPsuspend) {
    if (list.length < spnum) {
      console.log('开始')
      parentPort.postMessage('start')
    }
  } else {
    if (list.length > maxlen) {
      console.log('暂停')
      parentPort.postMessage('stop')
    }
  }
}, 500)
