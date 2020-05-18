'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserAddStateCitySchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('state_id').unsigned().index()

      table.foreign('state_id')
            .references('id')
            .on('states')
            .onDelete('cascade')
            .onUpdate('cascade')

      table.integer('city_id').unsigned().index()

      table.foreign('city_id')
            .references('id')
            .on('cities')
            .onDelete('cascade')
            .onUpdate('cascade')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserAddStateCitySchema
