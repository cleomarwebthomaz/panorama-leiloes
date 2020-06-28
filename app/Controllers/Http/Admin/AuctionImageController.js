'use strict'

const File = use('App/Services/File')

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
    const file = request.file('image', { types: ['image'], size: '2mb' })
    const image = await File.upload(file, 'uploads/auction-image')

    const photo = await AuctionImage.create({
      auction_id: params.auction_id,
      image
    })

    return response.json(photo)
  }

  async update({ params, request, response }) {
    const photo = await AuctionImage.findOrFail(params.id)

    if (photo.image) {
      File.remove(`uploads/photo-image/thumbs/${photo.image}`)
      File.remove(`uploads/photo-image/${photo.image}`)
    }

    const file = request.file('image', { types: ['image'], size: '2mb' })
    photo.image = await File.upload(file, 'uploads/photo-image')

    await photo.save()

    return response.json(photo)
  }

  async destroy({ params }) {
    const photo = await AuctionImage.findOrFail(params.id)

    if (photo.image) {
      File.remove(`uploads/auction-image/thumbs/${photo.image}`)
      File.remove(`uploads/auction-image/${photo.image}`)
    }

    await photo.delete()
  }

}

module.exports = AuctionImageController
