'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminRoleFilter = use('App/ModelFilters/Admin/RoleFilter')

class Role extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')

    this.addTrait('@provider:Filterable', AdminRoleFilter)
  }

  users() {
    return this.belongsToMany('App/Models/User')
  }

}

module.exports = Role
