'use strict'

const Team = use('App/Models/Team')
const { validateAll } = use('Validator')

class TeamController {

  async index({ response, request }) {
    const teams = await Team
                          .query()
                          .filter(request.all())
                          .paging(request.all())

    return response.json(teams)
  }

  async show({ response, params }) {
    const team = await Team.findOrFail(params.id)
    return response.json(team)
  }

  async store({ response, request }) {
    const rules = {
      name: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['label', 'name', 'description', 'observation', 'active'])
    data.active = !!data.active

    const team = await Team.create(data)

    return response.json({ success: true, data: team })
  }

  async update({ response, params, request }) {
    const data = request.only(['label', 'name', 'description', 'observation', 'active'])
    data.active = !!data.active

    const team = await Team.findOrFail(params.id)

    team.merge(data)
    await team.save()

    return response.json(team)
  }

  async destroy({ params }) {
    const team = await Team.findOrFail(params.id)
    await team.delete()
  }

}

module.exports = TeamController
