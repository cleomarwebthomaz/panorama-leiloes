'use strict'

const ModelFilter = use('ModelFilter')

class AdminSettingFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  name(value) {
    return this.where('name', 'LIKE', `%${value}%`)
  }

  search(value) {
    return this.where(function () {
      this.where('name', 'LIKE', `%${value}%`)
        .orWhere('slug', 'LIKE', `%${value}%`)
    })
  }

}

module.exports = AdminSettingFilter
