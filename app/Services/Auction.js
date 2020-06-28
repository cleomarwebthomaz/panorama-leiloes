const Ws = use('Ws')

const Auction = use('App/Models/Auction')
const AuctionBid = use('App/Models/AuctionBid')
const UserBid = use('App/Models/UserBid')
const User = use('App/Models/User')

class AuctionService {

  static getRank = async (auction_id) => {
    const bids = await UserBid
      .query()
      .where('auction_id', auction_id)
      .orderBy('total', 'DESC')
      .with('user.city.state')
      .with('auction')
      .limit(10)
      .fetch()

    return bids
  }

  static online = async (id) => {
    const auction = await Auction
      .query()
      .where('auctions.id', id)
      .withCount('bids', (builder) => {
      })
      // .with('winner', (builder) => {
      //   builder.with('city.state')
      // })
      .with('bids', (builder) => {
        builder
          .with('user.city.state')
          .orderBy('auction_bids.id', 'desc')
      })
      .first()

    const auctionBid = await AuctionBid
      .query()
      .where('auction_id', auction.id)
      .getSum('price')

    auction.total_bid = auction.bid_initial + auctionBid

    return auction
  }

  static async getWinner(auction) {
    const winner = await UserBid
      .query()
      .where('auction_id', auction.id)
      .where('user_id', auction.winner_id)
      .with('user.city.state')
      .first()

    return winner
  }

  static getOnline = async (id) => {
    const auction = await Auction
      .query()
      .where('auctions.id', id)
      .withCount('bids')
      .with('user.city.state')
      .with('bids', (builder) => {
        builder.orderBy('auction_bids.id', 'DESC')
      })
      .first()

    const total = await UserBid.query().where('auction_id', auction.id).getSum('total')
    auction.total_bid = auction.bid_initial + total

    return auction
  }

  static async makeOnline(id) {
    const auction = await Auction.findOrFail(id)
    auction.opened = true
    auction.on_date = new Date()

    await auction.save()

    const online = AuctionService.online(auction.id)

    const topic = Ws.getChannel('auction').topic('auction')
    if (topic) {
      topic.broadcastToAll('online', {
        auction: online
      })
    }

    return auction
  }

  static async makeFinish(id, winner_id) {
    const auction = await Auction.findOrFail(id)
    auction.opened = false
    auction.closed_date = new Date()

    if (winner_id) {
      auction.winner_id = winner_id
    }

    await auction.save()

    await User.query().update({ 'approved': false });

    const topicUser = Ws.getChannel('user').topic('user')
    if (topicUser) {
      topicUser.broadcastToAll('unapproved_all_user')
    }

    const topic = Ws.getChannel('auction').topic('auction')
    if (topic) {
      topic.broadcastToAll('closed', { auction: auction })
    }

    return auction
  }

}

module.exports = AuctionService