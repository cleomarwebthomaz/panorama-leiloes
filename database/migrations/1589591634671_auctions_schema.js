'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuctionsSchema extends Schema {
  up () {
    this.create('auctions', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.text('description')
      table.text('content')
      table.decimal('bid_initial').defaultTo(0)
      table.string('date')
      table.boolean('opened').defaultTo(0)
      table.boolean('active').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('auctions')
  }
}

module.exports = AuctionsSchema
