'use strict'

const Helpers = use('Helpers')

const exists = Helpers.promisify(require('fs').exists)

const AuctionImage = use('App/Models/AuctionImage')

class AuctionImageController {

  async index({ response, request, params }) {
    const auctionImages = await AuctionImage
                                  .query()
                                  .where('auction_images.auction_id', params.auction_id)
                                  .paging(request.all())

    return response.json(auctionImages)
  }

  async show({ response, params }) {
    const image = await AuctionImage.findOrFail(params.id)
    return response.json(image)
  }

  async store({ params, request, response }) {
    const file = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    const name = `${new Date().getTime()}.${file.subtype}`
    await file.move(Helpers.tmpPath('uploads/auction/photos'), {
      name,
    })

    if (!file.moved()) {
      return file.error()
    }

    const photo = await AuctionImage.create({
      auction_id: params.auction_id,
      image: name
    })

    return response.json(photo)
  }

  async update({ params, request, response }) {
    const photo = await AuctionImage.findOrFail(params.id)

    const file = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    const name = `${new Date().getTime()}.${file.subtype}`
    // const name = photo.image
    await file.move(Helpers.tmpPath('uploads/image/photos'), {
      name,
      overwrite: true
    })

    if (!file.moved()) {
      return file.error()
    }

    photo.image = name

    await photo.save()

    return response.json(photo)
  }

  async destroy({ params }) {
    const auctionImage = await AuctionImage.findOrFail(params.id)

    // const isExist = await exists(Helpers.tmpPath(`uploads/image/photos/${auctionImage.image}`))

    // return isExist

    // if (isExist) {
    //   const fs = Helpers.promisify(require('fs'))
    //   await fs.unlink(Helpers.tmpPath(`uploads/image/photos/${auctionImage.image}`))
    // }

    await auctionImage.delete()
  }

}

module.exports = AuctionImageController
