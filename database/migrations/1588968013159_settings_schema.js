'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SettingsSchema extends Schema {
  up () {
    this.create('settings', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('label').notNullable()
      table.text('value')
      table.string('file')
      table.text('observation')
      table.string('folder')
      table.timestamps()
    })
  }

  down () {
    this.drop('settings')
  }
}

module.exports = SettingsSchema
