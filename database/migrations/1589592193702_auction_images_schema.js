'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuctionImagesSchema extends Schema {
  up () {
    this.create('auction_images', (table) => {
      table.increments()
      table.integer('auction_id').unsigned().index()
      table.foreign('auction_id')
            .references('id')
            .on('auctions')
            .onDelete('cascade')
            .onUpdate('cascade')

      table.string('image').notNullable()
      table.integer('sort').defaultTo(0)
      table.integer('active').defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('auction_images')
  }
}

module.exports = AuctionImagesSchema
