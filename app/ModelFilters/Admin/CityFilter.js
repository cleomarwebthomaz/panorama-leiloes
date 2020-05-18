'use strict'

const ModelFilter = use('ModelFilter')

class AdminCityFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  state(state_id) {
    return this.where('state_id', Number(state_id))
  }

  search(value) {
    this.where('name', 'LIKE', `%${value}%`)
  }

}

module.exports = AdminCityFilter
