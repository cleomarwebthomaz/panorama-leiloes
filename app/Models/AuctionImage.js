'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Env = use('Env')

class AuctionImage extends Model {

	static boot () {
    super.boot()
    this.addTrait('Paging')
  }

  static get computed () {
    return ['url']
  }

  static scopeActive(query) {
    return query.where('auction_images.active', true)
  }

	getUrl ({ image }) {
    return `${Env.get('APP_URL')}/auction-image/${image}`
	}

}

module.exports = AuctionImage
