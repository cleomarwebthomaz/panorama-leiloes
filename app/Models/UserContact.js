'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserContact extends Model {

  static boot () {
    super.boot()
    this.addTrait('Paging')
  }

  type() {
    return this.belongsTo('App/Models/ContactType')
  }

}

module.exports = UserContact
