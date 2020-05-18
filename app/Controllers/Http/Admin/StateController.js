'use strict'

const State = use('App/Models/State')

class StateController {

  async index({ response, request }) {
    const states = await State
                          .query()
                          .filter(request.all())
                          .withCount('cities')
                          .paging(request.all())

    return response.json(states)
  }

  async show({ response, params }) {
    const state = await State.findOrFail(params.id)

    return response.json(state)
  }

  async store({ response, request, params }) {
    const data = request.only(['name'])

    const state = await State.create(data)

    return response.json(state)
  }

  async update({ response, params, request }) {
    const data = request.only(['name'])

    const state = await State.findOrFail(params.id)

    state.merge(data)
    await state.save()

    return response.json(state)
  }

  async destroy({ params }) {
    const state = await State.findOrFail(params.id)
    await state.delete()
  }

}

module.exports = StateController
