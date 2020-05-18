'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80)
      table.string('name', 80).notNullable()
      table.string('lastname', 80).notNullable()
      table.string('email', 254).notNullable()
      table.string('password', 60).notNullable()
      table.enum('person_type', ['individual', 'legal']).defaultTo('individual')
      table.string('document')
      table.string('city')
      table.string('state')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
