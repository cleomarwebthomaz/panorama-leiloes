'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminCityFilter = use('App/ModelFilters/Admin/CityFilter')

class City extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')
    this.addTrait('@provider:Filterable', AdminCityFilter)
    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'name' },
      strategy: 'dbIncrement',
      disableUpdates: false
    })
  }

  state() {
    return this.belongsTo('App/Models/State')
  }

}

module.exports = City
