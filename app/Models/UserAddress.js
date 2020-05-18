'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserAddress extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')
  }

  city() {
    return this.belongsTo('App/Models/City')
  }

  state() {
    return this.belongsTo('App/Models/State')
  }

  neighborhood() {
    return this.belongsTo('App/Models/Neighborhood')
  }

}

module.exports = UserAddress
