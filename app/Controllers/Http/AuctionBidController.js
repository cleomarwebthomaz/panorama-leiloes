'use strict'

const Ws = use('Ws')

const Auction = use('App/Models/Auction')
const AuctionBid = use('App/Models/AuctionBid')
const AuctionService = use('App/Services/Auction')
const UserBidService = use('App/Services/UserBid')

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

		const total = auction.bid_initial + auctionBid

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

		const currentAuction = await Auction.findOrFail(data.auction_id)
		if (!currentAuction.opened) {
			return response.json({ success: false, message: 'Esse leilão já foi encerrado.' })
		}

		const auctionBid = await AuctionBid.create(data)
		const bid = await AuctionBid.find(auctionBid.id)
		await bid.load('user.city.state')

		await UserBidService.update(auth.user.id, data.auction_id, data.price)

		const auction = await AuctionService.online(data.auction_id)
		const ranks = await AuctionService.getRank(data.auction_id)

		const topic = Ws.getChannel('auctionbid').topic('auctionbid')
		if (topic) {
			topic.broadcastToAll('new', {
				bid,
				auction,
				ranks
			})
		}

		return response.json({

		})
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
