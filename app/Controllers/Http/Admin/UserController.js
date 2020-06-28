'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Ws = use('Ws')

const User = use('App/Models/User')
const Role = use('App/Models/Role')
const State = use('App/Models/State')
const City = use('App/Models/City')
const UserState = use('App/Models/UserState')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, view }) {
    const page = request.get().page || 1

    const users = await User
      .query()
      .sortable(request)
      .filter(request.all())
      .with('roles')
      .with('userState')
      .orderBy('id', 'desc')
      .paginate(page)

    return view.render('admin.pages.users.index', {
      users: users.toJSON()
    })
  }

  async approve({ request, view }) {
    const page = request.get().page || 1

    const users = await User
      .query()
      .sortable(request)
      .filter(request.all())
      .with('roles')
      .with('userState')
      .where('users.approved', false)
      .orderBy('id', 'desc')
      .paginate(page)

    return view.render('admin.pages.users.approve', {
      users: users.toJSON()
    })
  }

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ view, request }) {
    const roles = await Role.pair('name', 'id')
    const states = await State.pair('uf', 'id')
    const userStates = await UserState.pair('name', 'id')

    let cities = []

    if (request.get().state_id) {
      cities = await City.query().where('state_id', user.state_id).pair('uf', 'id')
    }

    return view.render('admin.pages.users.create', {
      roles,
      states,
      cities,
      userStates,
    })
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session }) {
    const data = request.only([
      'user_state_id',
      'state_id',
      'city_id',
      'name',
      'lastname',
      'email',
      'phone',
      'person_type',
      'document',
      'approved',
    ])

    data.approved = request.input('approved') ? true : false

    const user = await User.create(data)
    await user.roles().attach(request.input('roles'))

    if (user) {
      session.flash({ success: 'Usuário cadastrado com sucesso.' })
      return response.route('admin.user.index')
    }

    return response.redirect('back')
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const states = await OrderState.query().where('paid', true).ids()
    const states_ids = states.join(',')

    const user = await User
      .query()
      .where('users.id', params.id)
      .with('address', (builder) => {
        builder
          .with('city.state')
      })
      .first()

    return view.render('admin.pages.users.show', {
      user: user.toJSON(),
      states_ids
    })
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, view }) {
    const user = await User.findOrFail(params.id)
    const roles = await Role.pair('name', 'id')
    const role_ids = await user.roles().ids()
    const states = await State.pair('uf', 'id')
    const userStates = await UserState.pair('name', 'id')
    const cities = await City.query().where('state_id', user.state_id).pair('name', 'id')

    return view.render('admin.pages.users.edit', {
      user: user.toJSON(),
      role_ids,
      roles,
      states,
      cities,
      userStates,
    })
  }

  async makeActive({ params, session, response }) {
    const user = await User.findOrFail(params.id)
    user.approved = !user.approved
    await user.save()
    session.flash({ success: 'Aprovado com sucesso' })

    const topic = Ws.getChannel('user').topic('user')

    if (topic) {
      topic.broadcast('approved', user)
    }

    return response.redirect('back')
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session }) {
    const data = request.only([
      'user_state_id',
      'state_id',
      'city_id',
      'name',
      'lastname',
      'email',
      'phone',
      'person_type',
      'document',
      'approved'
    ])

    const user = await User.findOrFail(params.id)

    if (request.input('password')) {
      data.password = request.input('password')
    }

    data.approved = request.input('approved') ? true : false

    user.merge(data)

    await user.save()
    await user.roles().sync(request.input('roles'))

    session.flash({ success: 'Usuário cadastrado com sucesso.' })

    return response.route('admin.user.index')
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response, session }) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    session.flash({ success: 'Registro excluido com sucesso.' })

    return response.route('admin.user.index')
  }

  async logout({ auth, response }) {
    await auth.logout()
    return response.redirect('/admin/login')
  }
}

module.exports = UserController
