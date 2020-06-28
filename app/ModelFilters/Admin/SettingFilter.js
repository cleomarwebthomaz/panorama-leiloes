'use strict'

const ModelFilter = use('ModelFilter')

class AdminSettingFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  name(value) {
    return this.where('name', 'LIKE', `%${value}%`)
  }

  search(search) {
    this.where(function () {
      this.where('settings.id', 'LIKE', `%${search}%`)
        .orWhere('settings.name', 'LIKE', `%${search}%`)
    })
  }

}

module.exports = AdminSettingFilter
