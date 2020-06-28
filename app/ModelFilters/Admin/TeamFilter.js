'use strict'

const ModelFilter = use('ModelFilter')

class TeamFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(search) {
    this.where(function () {
      this.where('id', 'LIKE', `%${search}%`)
        .orWhere('name', 'LIKE', `%${search}%`)
    })
  }
  
}

module.exports = TeamFilter
