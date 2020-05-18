'use strict'

const { validateAll } = use('Validator')

const User = use('App/Models/User')

class RegisterController {

  async store({ request, response }) {
    const rules = {
      state_id: 'required',
      city_id: 'required',
      name: 'required|min:3',
      phone: 'required|min:14',
      lastname: 'required|min:3',
      email: `required|email|unique,users`,
      person_type: 'required',
      document: `required|unique,users|min:14|max:18`,
    }

    const validation = await validateAll(request.all(), rules, {
      'state_id.required': 'Esse campo é obrigatório',
      'city_id.required': 'Esse campo é obrigatório',

      'name.required': 'O nome é obrigatório',
      'lastname.required': 'O nome é obrigatório',

      'email.required': 'E-mail é obrigatório',
      'email.email': 'Informe um email válido',
      'email.unique': 'Esse e-mail já está cadastrado em nossa base de dados',

      'document.required': 'Esse campo é obrigatório',
      'document.unique': 'Esse número já está cadastrado em nossa base de dados',
      'document.min': 'Esse número é inválido',
      'document.max': 'Esse número é inválido',

      'phone.required': 'Esse campo é obrigatório',
      'phone.min': 'Esse número é inválido',
      'phone.max': 'Esse número é inválido',

      'person_type.required': 'Esse campo é obrigatório',

      'password.required': 'A senha é obrigatória',
      'password.min': 'A senha deve ter mais de 4 caracteres',
    })

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['state_id', 'city_id', 'name', 'lastname', 'email', 'password', 'person_type', 'document', 'phone'])

    const user = await User.create(data)

    return response.json({ success: true, user })
  }

}

module.exports = RegisterController
