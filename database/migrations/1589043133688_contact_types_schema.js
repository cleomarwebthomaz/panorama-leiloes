'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserContactTypesSchema extends Schema {
  up () {
    this.create('contact_types', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('type').defaultTo('phone')
      table.text('observation')
      table.integer('sort').defaultTo(0)
      table.integer('active').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('contact_types')
  }
}

module.exports = UserContactTypesSchema
