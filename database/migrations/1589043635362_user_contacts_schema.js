'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPhonesSchema extends Schema {
  up () {
    this.create('user_contacts', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade')

      table.integer('contact_type_id').unsigned()
      table.foreign('contact_type_id').references('id').inTable('contact_types').onDelete('cascade').onUpdate('cascade')

      table.string('contact_name', 35)
      table.string('value', 35).notNullable()
      table.string('observation', 35)

      table.boolean('sort').defaultTo(0)
      table.boolean('favorite').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('user_contacts')
  }
}

module.exports = UserPhonesSchema
