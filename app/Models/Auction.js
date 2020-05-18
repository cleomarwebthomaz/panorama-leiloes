'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminAuctionFilter = use('App/ModelFilters/Admin/AuctionFilter')

class Auction extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')

    this.addTrait('@provider:Filterable', AdminAuctionFilter)
  }

  images() {
    return this.hasMany('App/Models/AuctionImage')
  }

  bids() {
    return this.hasMany('App/Models/AuctionBid')
  }
}

module.exports = Auction
