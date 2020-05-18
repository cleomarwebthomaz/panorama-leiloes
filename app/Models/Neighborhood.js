'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminNeighborhoodFilter = use('App/ModelFilters/Admin/NeighborhoodFilter')

class Neighborhood extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')
    this.addTrait('@provider:Filterable', AdminNeighborhoodFilter)
    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'name' },
      strategy: 'dbIncrement',
      disableUpdates: false
    })
  }

  city() {
    return this.belongsTo('App/Models/City')
  }

  state() {
    return this.belongsTo('App/Models/State')
  }

}

module.exports = Neighborhood
