const { validateAll } = use('Validator')

class ProfileController {

  async index({ response, auth }) {
    return response.json(auth.user)
  }

  async store({ response, request, auth }) {
    const rules = {
      state_id: 'required',
      city_id: 'required',
      name: 'required|min:3',
      lastname: 'required|min:3',
      email: `required|email|unique,users,id,${auth.user.id}`,
      person_type: 'required',
      document: `required|unique,users,id,${auth.user.id}`,
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['state_id', 'city_id', 'name', 'lastname', 'email', 'person_type', 'document', 'phone'])

    const user = auth.user

    user.merge(data)

    await user.save()

    response.json({ success: true, user: auth.user })
  }

  async changePassword({ request, response, auth }) {
    const rules = {
      password: 'required|min:4',
    }

    const validation = await validateAll(request.all(), rules, {
      'password.required': 'Informe uma nova senha',
      'password.min': 'A senha deve ter mais de 4 caracteres'
    })

    if (validation.fails()) { 
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['password'])

    const user = auth.user

    user.merge(data)

    await user.save()

    response.json({ success: true })
  }

}

module.exports = ProfileController
