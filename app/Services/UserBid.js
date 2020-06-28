const AuctionBid = use('App/Models/AuctionBid')
const UserBid = use('App/Models/UserBid')
const Auction = use('App/Models/Auction')

const Database = use('Database')

class UserBidService {

  async getAllByUser(user_id, auction_id) {
    const bids = await UserBid
      .query()
      .where('user_id', user_id)
      .where('auction_id', auction_id)
      .orderBy('user_bids', 'desc')
      .fetch()

    return bids
  }

  static async update(user_id, auction_id, price) {
    const currentValue = await this.updateTotal(user_id, auction_id, price)
    return currentValue
  }

  static async updateTotal(user_id, auction_id, price) {
    const user_bid = await UserBid.findOrCreate({ user_id, auction_id })
    const auction = await Auction.find(auction_id)

    let currentValue = await AuctionBid
      .query()
      .where('user_id', user_id)
      .where('auction_id', auction_id)
      .select(Database.raw(`SUM(price) as total`))
      .first()

    user_bid.bid_initial = auction.bid_initial

    const total = currentValue.total + auction.bid_initial

    user_bid.total = total

    await user_bid.save()
    return total.total
  }

}

module.exports = UserBidService