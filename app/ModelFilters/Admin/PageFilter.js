'use strict'

const ModelFilter = use('ModelFilter')

class PageFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(search) {
    this.where(function () {
      this.where('pages.id', 'LIKE', `%${search}%`)
        .orWhere('pages.title', 'LIKE', `%${search}%`)
    })
  }

}

module.exports = PageFilter
