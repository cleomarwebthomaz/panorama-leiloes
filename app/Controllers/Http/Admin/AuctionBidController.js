'use strict'

const Ws = use('Ws')

const AuctionBid = use('App/Models/AuctionBid')

class AuctionBidController {

		async index({ response, params, request }) {
				const auctionBid = await AuctionBid
																		.query()
																		.where('auction_id', params.auction_id)
																		.with('auction')
																		.with('user')
																		.paging(request.all())

				return response.json(auctionBid)
		}
	
    async show({ response, params }) {
	    const auctionBid = await AuctionBid.findOrFail(params.id)
	    return response.json(auctionBid)
    }

    async store({ response, request, params }) {
      const data = request.only(['name', 'price', 'description'])

      data.auction_id = params.auction_id

	    const auctionBid = await AuctionBid.create(data)

	    return response.json(auctionBid)
    }

    async update({ response, params, request }) {
	    const data = request.only(['name', 'price', 'description'])

	    const auctionBid = await AuctionBid.findOrFail(params.id)

	    auctionBid.merge(data)
	    await auctionBid.save()

	    return response.json(auctionBid)
    }

    async destroy({ params }) {
	    const auctionBid = await AuctionBid.findOrFail(params.id)
	    await auctionBid.delete()
    }

}

module.exports = AuctionBidController
