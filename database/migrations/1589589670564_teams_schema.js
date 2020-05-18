'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeamsSchema extends Schema {
  up () {
    this.create('teams', (table) => {
      table.increments()
      table.string('label').notNullable()
      table.string('name').notNullable()
      table.string('observation')
      table.string('description')
      table.boolean('active').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('teams')
  }
}

module.exports = TeamsSchema
