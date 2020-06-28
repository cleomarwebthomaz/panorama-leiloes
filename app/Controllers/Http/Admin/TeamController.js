'use strict'

const Team = use('App/Models/Team')
const { validateAll } = use('Validator')

class TeamController {

  async index({ request, view }) {
    const teams = await Team
      .query()
      .filter(request.all())
      .paging(request.all())

    return view.render('admin.pages.team.index', {
      teams: teams.toJSON(),
    })
  }

  async show({ response, params }) {
    const team = await Team.findOrFail(params.id)
    return response.json(team)
  }

  create({ view }) {
    return view.render('admin.pages.team.create')
  }

  async store({ response, request, session }) {
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

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.team.index')
  }

  async edit({ view, params }) {
    const team = await Team.findOrFail(params.id)

    return view.render('admin.pages.team.edit', {
      team: team.toJSON(),
    })
  }

  async update({ response, params, request, session }) {
    const data = request.only(['label', 'name', 'description', 'observation', 'active'])
    data.active = !!data.active

    const team = await Team.findOrFail(params.id)

    team.merge(data)
    await team.save()

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.team.index')
  }

  async destroy({ params, session, response }) {
    const team = await Team.findOrFail(params.id)
    await team.delete()
    session.flash({ success: 'Página excluida com sucesso' })
    return response.redirect('back')
  }

}

module.exports = TeamController
