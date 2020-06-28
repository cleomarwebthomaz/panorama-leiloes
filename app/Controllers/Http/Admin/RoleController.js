'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Role = use('App/Models/Role')
const Permission = use('Adonis/Acl/Permission')

/**
 * Resourceful controller for interacting with roles
 */
class RoleController {
  /**
   * Show a list of all roles.
   * GET roles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const roles = await Role
      .query()
      .sortable(request)
      .with(['permissions'])
      .paginate()

    return view.render('admin.pages.role.index', {
      roles: roles.toJSON()
    })
  }

  /**
   * Render a form to be used for creating a new role.
   * GET roles/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ view }) {
    return view.render('admin.pages.role.create')
  }

  /**
   * Create/save a new role.
   * POST roles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session }) {
    const data = request.only(['name', 'slug'])

    const role = await Role.create(data)

    if (role) {
      session.flash({ success: 'Regra criada com sucesso.' })
      return response.route('admin.role.index')
    }

    return response.back()
  }

  /**
   * Display a single role.
   * GET roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing role.
   * GET roles/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    let role = await Role.findOrFail(params.id)
    await role.load('permissions')
    role = role.toJSON()
    const rolePermissions = role.permissions

    const permissions = await Permission.all()

    let ids = []
    rolePermissions.map(function (s) {
      ids.push(s.id)
    })

    return view.render('admin.pages.role.edit', {
      role: role,
      permissions: permissions.toJSON(),
      rolesSelecteds: ids
    })
  }

  /**
   * Update role details.
   * PUT or PATCH roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session }) {
    const data = request.only(['name', 'slug', 'description', ' permissions'])

    const role = await Role.findOrFail(params.id)
    role.name = data.name
    role.slug = data.slug
    role.description = data.description

    await role.permissions().detach()
    await role.permissions().attach(request.input('permissions'))
    const update = await role.save()

    session.flash({ success: 'Regra atualizada com sucesso.' })

    return response.route('admin.role.index')
  }

  /**
   * Delete a role with id.
   * DELETE roles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const role = await Role.findOrFail(params.id)
    await role.delete()

    session.flash({ success: 'Regra deletada com sucesso.' })

    return response.route('admin.role.index')
  }
}

module.exports = RoleController
