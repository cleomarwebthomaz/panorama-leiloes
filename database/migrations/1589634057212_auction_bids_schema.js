'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuctionBidsSchema extends Schema {
  up () {
    this.create('auction_bids', (table) => {
      table.increments()

      table.integer('auction_id').unsigned().index()
      table.foreign('auction_id')
            .references('id')
            .on('auctions')
            .onDelete('cascade')
            .onUpdate('cascade')

      table.integer('user_id').unsigned().index()
      table.foreign('user_id')
            .references('id')
            .on('users')
            .onDelete('cascade')
            .onUpdate('cascade')      

      table.decimal('price').defaultTo(0)

      table.timestamps()
    })
  }

  down () {
    this.drop('auction_bids')
  }
}

module.exports = AuctionBidsSchema
