'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {

  async index({ response, request }) {
    const users = await User
                          .query()
                          .with('state')
                          .filter(request.all())
                          .paging(request.all())

    return response.json(users)
  }

  async show({ response, params }) {
    const user = await User
                        .query()  
                        .where('users.id', params.id)
                        .with('state')
                        .withCount('contacts')
                        .first()

    const roles_ids = await user.roles().ids()
    user.roles_ids = roles_ids

    return response.json(user)
  }

  async store({ response, request }) {
    const rules = {
      name: 'required|min:3',
      lastname: 'required|min:3',
      email: 'required|email',
      password: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['state_id', 'city_id', 'user_state_id', 'name', 'lastname', 'email', 'phone', 'person_type', 'document', 'password'])

    const user = await User.create(data)

    return response.json({ success: true, data: user })
  }

  async update({ response, params, request }) {
    const data = request.only(['state_id', 'city_id', 'user_state_id', 'name', 'lastname', 'email', 'phone', 'person_type', 'document', 'password'])

    const user = await User.findOrFail(params.id)

    if (!data.password) delete user.password

    user.merge(data)
    await user.save()
    user.roles().sync(request.input('roles_ids'))

    return response.json(user)
  }

  async destroy({ params }) {
    const user = await User.findOrFail(params.id)
    await user.delete()
  }

}

module.exports = UserController
