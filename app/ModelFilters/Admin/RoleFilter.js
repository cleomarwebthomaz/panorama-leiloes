'use strict'

const ModelFilter = use('ModelFilter')

class AdminRoleFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  search(value) {
    return this.where(function () {
      this.where('name', 'LIKE', `%${value}%`)
        .orWhere('slug', 'LIKE', `%${value}%`)
    })
  }

}

module.exports = AdminRoleFilter
