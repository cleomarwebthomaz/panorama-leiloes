'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserAddStatusSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('user_state_id')
          .after('id').unsigned()

      table
          .foreign('user_state_id')
          .references('id')
          .inTable('user_states')
          .onDelete('cascade')
          .onUpdate('cascade')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('users_state_id_foreign_state_id')
    })
  }
}

module.exports = UserAddStatusSchema
