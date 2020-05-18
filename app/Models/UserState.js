'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminUserStateFilter = use('App/ModelFilters/Admin/UserStateFilter')

class UserState extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')
    this.addTrait('@provider:Filterable', AdminUserStateFilter)
  }

  users() {
    return this.hasMany('App/Models/User')
  }

}

module.exports = UserState
