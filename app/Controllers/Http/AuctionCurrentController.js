'use strict'

const moment = require('moment')
const Auction = use('App/Models/Auction')
const AuctionService = use('App/Services/Auction')

class AuctionCurrentController {

	async index({ response }) {

		const current = await Auction
			.query()
			.where('opened', 1)
			.where('date', moment().format('YYYY-MM-DD'))
			.select('id')
			.first()

		let auction = null

		if (current) {
			auction = await AuctionService.online(current.id)
		}

		return response.json(auction)
	}

}

module.exports = AuctionCurrentController
