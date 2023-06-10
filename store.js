import fs from 'fs'

export default {
  getValue(key) {
    const data = fs.readFileSync('key-value.json', 'utf8')
    const jsonData = JSON.parse(data)
    return jsonData[key]
  },
  setValue(key, value) {
    const data = JSON.stringify({ [key]: value })
    fs.writeFileSync('key-value.json', data)
  }
}
