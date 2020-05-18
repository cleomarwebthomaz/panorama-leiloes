'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminSettingFilter = use('App/ModelFilters/Admin/SettingFilter')

class Setting extends Model {
  static boot () {
    super.boot()
    this.addTrait('Paging')

    this.addTrait('@provider:Filterable', AdminSettingFilter)
  }

}

module.exports = Setting
