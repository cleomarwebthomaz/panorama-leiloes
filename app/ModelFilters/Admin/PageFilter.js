'use strict'

const ModelFilter = use('ModelFilter')

class PageFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(value) {
    return this.where('title', 'LIKE', `%${value}%`)
  }

}

module.exports = PageFilter
