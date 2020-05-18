'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagesSchema extends Schema {
  up () {
    this.create('pages', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.text('content')
      table.boolean('active').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('pages')
  }
}

module.exports = PagesSchema
