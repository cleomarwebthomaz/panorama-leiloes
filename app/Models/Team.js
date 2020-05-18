'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminTeamFilter = use('App/ModelFilters/Admin/TeamFilter')

class Team extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')

    this.addTrait('@provider:Filterable', AdminTeamFilter)
  }

}

module.exports = Team
