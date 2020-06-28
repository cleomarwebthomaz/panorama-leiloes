'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

const moment = require('moment')

const AdminAuctionFilter = use('App/ModelFilters/Admin/AuctionFilter')

class Auction extends Model {

  static boot() {
    super.boot()
    this.addTrait('Paging')

    this.addTrait('@provider:Filterable', AdminAuctionFilter)
  }

  static get computed() {
    return ['image_url', 'date_formated', 'closed_date_formated']
  }

  winner() {
    return this.belongsTo('App/Models/User', 'winner_id', 'id')
  }

  winnerBid() {
    return this.hasOne('App/Models/UserBid', 'winner_id', 'id')
  }

  getImageUrl({ image }) {
    return `${Env.get('APP_URL')}/thumb?src=auction&f=${image}&w=618&h=450`
  }

  images() {
    return this.hasMany('App/Models/AuctionImage')
  }

  bids() {
    return this.hasMany('App/Models/AuctionBid')
  }

  getDate(date) {
    return moment(date).format('YYYY-MM-DD')
  }

  getClosedDateFormated({ closed_date }) {
    if (!closed_date) return null
    return moment(closed_date).format('DD/MM/YYYY')
  }

  getDateFormated({ date }) {
    if (!date) return
    return moment(date).format('DD/MM/YYYY')
  }

  // static get dates() {
  //   return super.dates.concat(['date'])
  // }

  // static formatDates(field, value) {
  //   console.log(field)
  //   if (field === 'date') {
  //     return value.format('DD/MM/YYYY')
  //   }
  //   return super.formatDates(field, value)
  // }

}

module.exports = Auction
