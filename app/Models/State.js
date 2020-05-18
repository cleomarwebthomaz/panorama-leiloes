'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminStateFilter = use('App/ModelFilters/Admin/StateFilter')

class State extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')
    this.addTrait('@provider:Filterable', AdminStateFilter)
    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'name' },
      strategy: 'dbIncrement',
      disableUpdates: false
    })
  }

  cities() {
    return this.hasMany('App/Models/City')
  }

}

module.exports = State
