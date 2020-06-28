'use strict'

const { validateAll } = use('Validator')

const City = use('App/Models/City')
const State = use('App/Models/State')

class CityController {

  async index({ view, request, response }) {
    const states = await State.pair('uf', 'id')

    if (request.ajax()) {
      const items = await City.query().filter(request.all()).fetch()
      return response.json(items)
    }

    const cities = await City
      .query()
      .filter(request.all())
      .with('state')
      .paging(request.all())

    return view.render('admin.pages.city.index', {
      cities: cities.toJSON(),
      states,
    })
  }

  async show({ response, params }) {
    const city = await City.findOrFail(params.id)
    await city.load('state')

    return response.json(city)
  }

  async create({ view }) {
    const states = await State.pair('uf', 'id')
    return view.render('admin.pages.city.create', {
      states
    })
  }

  async store({ response, request, params, session }) {
    const rules = {
      name: 'required',
    }

    const validation = await validateAll(request.all(), rules, {
      'name.required': 'Esse campor é obrigatório'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
      return response.redirect('back')
    }

    const data = request.only(['state_id', 'name', 'description', 'observation'])

    await City.create(data)

    session.flash({ success: 'Salvo com sucesso' })

    return response.route('admin.city.index')
  }

  async edit({ view, params }) {
    const city = await City.findOrFail(params.id)
    const states = await State.pair('uf', 'id')

    return view.render('admin.pages.city.edit', {
      states: states,
      city: city.toJSON(),
    })
  }

  async update({ response, params, request, session }) {
    const rules = {
      name: 'required',
    }

    const validation = await validateAll(request.all(), rules, {
      'name.required': 'Esse campor é obrigatório'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
      return response.redirect('back')
    }

    const data = request.only(['state_id', 'name', 'description', 'observation'])

    const city = await City.findOrFail(params.id)

    city.merge(data)
    await city.save()

    session.flash({ success: 'Salvo com sucesso' })

    return response.route('admin.city.index')
  }

  async destroy({ params, response, session }) {
    const city = await City.findOrFail(params.id)
    await city.delete()
    session.flash({ success: 'Registro deletado com sucesso' })
    return response.route('admin.city.index')
  }

}

module.exports = CityController
