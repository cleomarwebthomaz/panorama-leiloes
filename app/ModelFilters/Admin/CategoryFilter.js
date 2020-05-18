'use strict'

const ModelFilter = use('ModelFilter')

class AdminCategoryFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  parent(parent_id) {
    return this.where('parent_id', Number(parent_id))
  }

  active(active) {
    return this.where('active', Number(active))
  }

  search(value) {
    return this.where(function () {
      this.where('name', 'LIKE', `%${value}%`)
        .orWhere('slug', 'LIKE', `%${value}%`)
    })
  }

}

module.exports = AdminCategoryFilter
