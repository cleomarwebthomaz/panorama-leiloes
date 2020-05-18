'use strict'

const Auction = use('App/Models/Auction')

class AuctionCurrentController {

	async index({ response }) {

	    const auction = await Auction
															.query()
															.where('opened', 1)
                              .first()

	    return response.json(auction)
	}

}

module.exports = AuctionCurrentController
