const Helpers = use('Helpers')

const sharp = require('sharp')
const fs = require('fs')
var path = require("path");

const thumbnail = require('../../config/thumbnail')

class Thumbnail {

  static async cropUrl({ response, request }) {
    const width = request.get().w || 50
    const height = request.get().h
    const path = request.get().src
    const file = request.get().f

    const configThumb = thumbnail[path]

    // Validation
    if (!file || !path) return response.status(404).send('Not Found')
    if (!configThumb) return response.status(404).send('Invalid Size')

    if (!fs.existsSync(Helpers.tmpPath(`uploads/${path}/${file}`))) {
      return response.status(404).send('Not Found')
    }

    let validSize = false
    configThumb.map(thumb => {
      if (Number(width) === thumb.w && Number(height) === thumb.h) {
        validSize = true
      }
    })

    if (!validSize) return response.status(404).send('Invalid Size')

    const ext = file.split('.')[0]
    const filename = file.split('.')[1]

    if (!ext || !filename) return response.status(404).send('Not Found')

    const inputFile = Helpers.tmpPath(`uploads/${path}/${file}`)
    if (!fs.existsSync(inputFile)) {
      return response.status(404).send('Not Found existsSync')
    }

    const folderThumbs = Helpers.tmpPath(`uploads/${path}/thumbs`)
    if (!fs.existsSync(folderThumbs)) fs.mkdirSync(folderThumbs)

    const folderThumb = Helpers.tmpPath(`uploads/${path}/thumbs/${file}`)
    if (!fs.existsSync(folderThumb)) fs.mkdirSync(folderThumb)

    const outputFile = `${folderThumb}/${width}x${height}-${file}`

    // Return file exists
    if (fs.existsSync(outputFile)) {
      return response.download(outputFile)
    }

    await sharp(inputFile)
      .resize(parseInt(width), parseInt(height))
      .toFile(outputFile, (err, info) => { })
      .toBuffer()

    return response.download(outputFile)
  }

}

module.exports = Thumbnail
