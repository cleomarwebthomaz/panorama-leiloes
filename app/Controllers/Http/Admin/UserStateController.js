'use strict'

const { validateAll } = use('Validator')

const UserState = use('App/Models/UserState')

class UserStatesController {

  async index({ response, request }) {
    const status = await UserState
                            .query()
                            .withCount('users')
                            .filter(request.all())
                            .paging(request.all())

    return response.json(status)
  }

  async show({ response, params }) {
    const state = await UserState.findOrFail(params.id)
    return response.json(state)
  }

  async store({ response, request }) {
    const rules = {
      name: 'required|unique:user_states',
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['name', 'description', 'observation', 'active', 'blocked', 'color', 'text_color', 'canceled', 'can_login', 'pending', 'recused'])

    data.active = data.active ? true : false
    data.blocked = data.blocked ? true : false
    data.canceled = data.canceled ? true : false
    data.can_login = data.can_login ? true : false
    data.pending = data.pending ? true : false
    data.recused = data.recused ? true : false

    const state = await UserState.create(data)

    return response.json({ success: true, data: state })
  }

  async update({ response, params, request }) {
    const rules = {
      name: `required|unique:user_states,id,${params.id}`,
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['name', 'description', 'observation', 'active', 'blocked', 'color', 'text_color', 'canceled', 'can_login', 'pending', 'recused'])

    data.active = data.active ? true : false
    data.blocked = data.blocked ? true : false
    data.canceled = data.canceled ? true : false
    data.can_login = data.can_login ? true : false
    data.pending = data.pending ? true : false
    data.recused = data.recused ? true : false

    const state = await UserState.findOrFail(params.id)

    state.merge(data)
    await state.save()

    return response.json(state)
  }

  async destroy({ params }) {
    const state = await UserState.findOrFail(params.id)
    await state.delete()
  }

}

module.exports = UserStatesController
