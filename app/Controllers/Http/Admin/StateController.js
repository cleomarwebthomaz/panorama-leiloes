'use strict'

const { validateAll } = use('Validator')

const State = use('App/Models/State')

class StateController {

  async index({ response, request, view }) {
    const states = await State
      .query()
      .filter(request.all())
      .withCount('cities')
      .paging(request.all())

    return view.render('admin.pages.state.index', {
      states: states.toJSON()
    })
  }

  async show({ response, params }) {
    const state = await State.findOrFail(params.id)
    return response.json(state)
  }

  async edit({ view, params }) {
    const state = await State.findOrFail(params.id)
    return view.render('admin.pages.state.edit', {
      state: state.toJSON(),
    })
  }

  create({ view }) {
    return view.render('admin.pages.state.create')
  }

  async store({ response, request, session }) {
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

    const data = request.only(['name'])

    await State.create(data)

    session.flash({ success: 'Salvo com sucesso' })

    return response.route('admin.state.index')
  }

  async update({ response, params, request, session }) {
    const data = request.only(['name'])

    const state = await State.findOrFail(params.id)

    state.merge(data)
    await state.save()

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.state.index')
  }

  async destroy({ params, session, response }) {
    const state = await State.findOrFail(params.id)
    await state.delete()
    session.flash({ success: 'Página excluida com sucesso' })
    return response.redirect('back')
  }

}

module.exports = StateController
