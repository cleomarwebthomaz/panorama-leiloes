'use strict'

const ModelFilter = use('ModelFilter')

class AdminStateFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(search) {
    this.where(function () {
      this.where('states.id', 'LIKE', `%${search}%`)
        .orWhere('states.name', 'LIKE', `%${search}%`)
        .orWhere('states.uf', 'LIKE', `%${search}%`)
    })
  }

}

module.exports = AdminStateFilter
