'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const moment = require('moment')

class UserBid extends Model {

  static boot() {
    super.boot()
    this.addTrait('Paging')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  auction() {
    return this.belongsTo('App/Models/Auction')
  }

}

module.exports = UserBid
