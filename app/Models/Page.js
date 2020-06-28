'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

const AdminPageFilter = use('App/ModelFilters/Admin/PageFilter')

class Page extends Model {
  static sortable() {
    return ['id', 'title', 'active', 'created_at', 'updated_at']
  }

  static get computed() {
    return ['image_url', 'closed']
  }

  static boot() {
    super.boot()
    this.addTrait('Sortable')
    this.addTrait('@provider:Filterable', AdminPageFilter)
  }

  getImageUrl({ image }) {
    if (!image) {
      return null
    }

    return `${Env.get('APP_DOMAIN')}/uploads/pages/${image}`
  }

  tags() {
    return this.belongsToMany('App/Models/Tag')
  }

  static get dates() {
    return super.dates.concat(['updated_at', 'created_at', 'start', 'end'])
  }

  static castDates(field, value) {
    if (field === 'updated_at' || field === 'created_at') {
      return value.format('DD/MM/YYYY h:m:s')
    }

    if (field === 'start' || field === 'end') {
      return value.format('DD/MM/YYYY')
    }
  }

}

module.exports = Page
