'use strict'

const ModelFilter = use('ModelFilter')

class AdminAuctionFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(value) {
    this.where('title', 'LIKE', `%${value}%`)
  }

}

module.exports = AdminAuctionFilter
