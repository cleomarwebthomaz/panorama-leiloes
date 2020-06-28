'use strict'

const ModelFilter = use('ModelFilter')

class AdminAuctionFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(search) {
    this.where(function () {
      this.where('auctions.id', 'LIKE', `%${search}%`)
        .orWhere('auctions.title', 'LIKE', `%${search}%`)
    })
  }

}

module.exports = AdminAuctionFilter
