'use strict'

const ModelFilter = use('ModelFilter')

class AdminStateFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(value) {
    this.where('name', 'LIKE', `%${value}%`)
  }

}

module.exports = AdminStateFilter
