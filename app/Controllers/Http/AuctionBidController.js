'use strict'

const Ws = use('Ws')

const Auction = use('App/Models/Auction')
const AuctionBid = use('App/Models/AuctionBid')

class AuctionBidController {

		async index({ response, params, request, auth }) {
				const auctionBid = await AuctionBid
																		.query()
																		.where('user_id', auth.user.id)
																		.where('auction_id', params.auction_id)
																		.with('auction')
																		.with('user')
																		.paging(request.all())

				return response.json(auctionBid)
		}

		async getTotal({ response, params }) {
			const auction = await Auction.findOrFail(params.auction_id)

			const auctionBid = await AuctionBid
																	.query()
																	.where('auction_id', auction.id)
																	.getSum('price')

			const total = auction.bid_initial	 + auctionBid

			return response.json({ total })
		}

    async show({ response, params }) {
	    const auctionBid = await AuctionBid.findOrFail(params.id)
	    return response.json(auctionBid)
    }

    async store({ response, request, params, auth }) {
      const data = request.only(['name', 'price', 'description'])

      data.user_id = auth.user.id
      data.auction_id = params.auction_id

	    const auctionBid = await AuctionBid.create(data)

			const topic = Ws.getChannel('auctionbid').topic('message')
			
      if(topic){
        topic.broadcast('message', auctionBid)
      }

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
