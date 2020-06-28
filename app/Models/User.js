'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const AdminUserFilter = use('App/ModelFilters/Admin/UserFilter')

class User extends Model {

  static sortable() {
    return ['id', 'name', 'active', 'created_at', 'updated_at']
  }

  static boot() {
    super.boot()

    this.addTrait('@provider:Filterable', AdminUserFilter)

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission',
      'Sortable'
    ]
  }

  static scopeGroup(query, group) {
    return query.whereHas('roles', (builder) => {
      builder.where('slug', group)
    }, '>', 0)
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  userState() {
    return this.belongsTo('App/Models/UserState')
  }

  city() {
    return this.belongsTo('App/Models/City')
  }

  state() {
    return this.belongsTo('App/Models/State')
  }

  roles() {
    return this.hasMany('App/Models/Role')
  }

  address() {
    return this.hasOne('App/Models/UserAddress')
  }

  cities() {
    return this.belongsToMany('App/Models/City')
  }

  static get dates() {
    return super.dates.concat(['updated_at', 'created_at'])
  }

  static castDates(field, value) {
    if (field === 'updated_at' || field === 'created_at') {
      return value.format('DD/MM/YYYY h:m:s')
    }
  }
}

module.exports = User
