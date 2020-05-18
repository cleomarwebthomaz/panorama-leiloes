'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserStatusSchema extends Schema {
  up () {
    this.create('user_states', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.text('description')
      table.text('observation')
      table.string('color').notNullable()
      table.string('text_color').notNullable()
      table.boolean('active').defaultTo(0)
      table.boolean('blocked').defaultTo(0)
      table.boolean('canceled').defaultTo(0)
      table.boolean('can_login').defaultTo(0)
      table.boolean('pending').defaultTo(0)
      table.boolean('recused').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('user_states')
  }
}

module.exports = UserStatusSchema
