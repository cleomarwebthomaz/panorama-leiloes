'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminPageFilter = use('App/ModelFilters/Admin/PageFilter')

class Page extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')

    this.addTrait('@provider:Filterable', AdminPageFilter)
  }

}

module.exports = Page
