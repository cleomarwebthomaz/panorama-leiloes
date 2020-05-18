'use strict'

const Auction = use('App/Models/Auction')
const { validateAll } = use('Validator')

class AuctionController {

  async index({ response, request }) {
    const auctions = await Auction
                            .query()
                            .filter(request.all())
                            .withCount('images', (builder) => {
                              builder.active()
                            })
                            .withCount('bids')
                            .paging(request.all())

    return response.json(auctions)
  }

  async show({ response, params }) {
    const auction = await Auction
                          .query()
                          .where('auctions.id', params.id)
                          .withCount('images')
                          .first()

    return response.json(auction)
  }

  async store({ response, request }) {
    const rules = {
      title: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['title', 'description', 'date', 'content', 'active', 'opened'])
    data.opened = !!data.opened
    data.active = !!data.active
    
    const auction = await Auction.create(data)

    return response.json({ success: true, data: auction })
  }

  async update({ response, params, request }) {
    const rules = {
      title: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['title', 'description', 'date', 'content', 'active', 'opened'])

    data.opened = !!data.opened
    data.active = !!data.active

    const auction = await Auction.findOrFail(params.id)

    auction.merge(data)
    await auction.save()

    return response.json(auction)
  }

  async destroy({ params }) {
    const auction = await Auction.findOrFail(params.id)
    await auction.delete()
  }

}

module.exports = AuctionController
