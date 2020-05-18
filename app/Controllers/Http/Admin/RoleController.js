'use strict'

const Role = use('App/Models/Role')
const { validateAll } = use('Validator')

class RoleController {

  async index({ response, request }) {
    const roles = await Role
                          .query()
                          .filter(request.all())
                          .withCount('users')
                          .paging(request.all())

    return response.json(roles)
  }

  async show({ response, params }) {
    const role = await Role.findOrFail(params.id)
    role.teste = [50]
    return response.json(role)
  }

  async store({ response, request }) {
    const rules = {
      slug: 'required|unique:roles',
      name: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['name', 'slug', 'description', 'active'])

    const role = await Role.create(data)

    return response.json({ success: true, data: role })
  }

  async update({ response, params, request }) {
    const data = request.only(['name', 'slug', 'description', 'active'])

    const role = await Role.findOrFail(params.id)

    role.merge(data)
    await role.save()

    return response.json(role)
  }

  async destroy({ params }) {
    const role = await Role.findOrFail(params.id)
    await role.delete()
  }

}

module.exports = RoleController
