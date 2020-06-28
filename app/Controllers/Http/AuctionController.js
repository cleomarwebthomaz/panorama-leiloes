const moment = require('moment')

const Auction = use('App/Models/Auction')
const AuctionBid = use('App/Models/AuctionBid')

class AuctionController {

  async schedule({ response, request }) {
    const actions = await Auction
      .query()
      .with('images', (builder) => {
        builder.active()
      })
      .orderBy('auctions.id', 'desc')
      .where('date', '>=', moment().format('Y-MM-DD'))
      .paging(request.all())

    return response.json(actions)
  }

  async index({ response, request }) {
    const actions = await Auction
      .query()
      .with('images', (builder) => {
        builder.active()
      })
      .orderBy('auctions.id', 'desc')
      .paging(request.all())

    return response.json(actions)
  }

  async show({ response, params }) {
    const auction = await Auction
      .query()
      .where('auctions.id', params.id)
      .with('images', (builder) => {
        builder.active()
      })
      .first()

    const auctionBid = await AuctionBid
      .query()
      .where('auction_id', auction.id)
      .getSum('price')

    auction.total_bid = auction.bid_initial + auctionBid

    return response.json(auction)
  }

}

module.exports = AuctionController