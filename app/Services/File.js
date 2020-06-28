const Helpers = use('Helpers')
const fs = require('fs')
const rimraf = require("rimraf")
const uniqid = require('uniqid')

class File {

  static remove(source) {
    if (this.exists(source)) {
      rimraf.sync(Helpers.tmpPath(source))
    }
  }

  static exists(source) {
    return fs.existsSync(Helpers.tmpPath(source))
  }

  static async upload(file, folder) {
    const name = `${uniqid()}.${file.subtype}`
    await file.move(Helpers.tmpPath(folder), { name })
    if (!file.moved()) { return file.error() }
    return name
  }

}

module.exports = File