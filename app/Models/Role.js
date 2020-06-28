'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const BaseRole = use('Adonis/Acl/Role')

class Role extends Model {

  static sortable() {
    return ['id', 'name', 'slug', 'created_at', 'updated_at']
  }

  static boot() {
    super.boot()
    this.addTrait('Sortable')
  }


  static get dates() {
    return super.dates.concat(['updated_at', 'created_at'])
  }

  static castDates(field, value) {
    if (field === 'updated_at' || field === 'created_at') {
      return value.format('DD/MM/YYYY h:m:s')
    }
  }

  static get rules() {
    return {
      slug: 'required|min:3|max:255|regex:^[a-zA-Z0-9_-]+$',
      name: 'required|min:3|max:255',
      description: 'min:3|max:1000'
    }
  }

  permissions() {
    return this.belongsToMany('Adonis/Acl/Permission')
  }

  async getPermissions() {
    const permissions = await this.permissions().fetch()
    return permissions.rows.map(({ slug }) => slug)
  }

}

module.exports = Role
