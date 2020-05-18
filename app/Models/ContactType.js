'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminContactTypeFilter = use('App/ModelFilters/Admin/ContactTypeFilter')

class ContactType extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')
    this.addTrait('@provider:Filterable', AdminContactTypeFilter)
  }

}

module.exports = ContactType
