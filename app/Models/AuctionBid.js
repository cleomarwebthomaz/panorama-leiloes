'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminAuctionBidFilter = use('App/ModelFilters/Admin/AuctionBidFilter')

class AuctionBid extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')

    this.addTrait('@provider:Filterable', AdminAuctionBidFilter)
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  auction() {
    return this.belongsTo('App/Models/Auction')
  }

}

module.exports = AuctionBid
