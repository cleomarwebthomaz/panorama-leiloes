'use strict'

const Mail = use('Mail')
const { validateAll } = use('Validator')

const User = use('App/Models/User')

class LoginController {

  async store({ response, request }) {
    try {
      const { email } = request.all()
  
      const user = await User.findBy('email', email)

      const date = new Date();
      let minute = date.getMinutes()
      let seconde = date.getSeconds()
      const mile = String(date.getMilliseconds()).slice(0,2)

      if (minute <= 9) minute = `0${minute}`
      if (seconde <= 9) seconde = `0${seconde}`

      const code = `${mile}-${minute}-${seconde}`

      user.temp_code = code
      user.code_time = date
      await user.save()

      // await Mail.send('emails.password', { code: code, user: user.toJSON() }, (message) => {
      //   message
      //       .from('cleomarocampos@gmail.com')
      //       .to('cleomarocampos@gmail.com')
      //       .subject('Recuperar Senha')
      // })

      return response.json({
        success: true,
        user,
        code
      })
    } catch (error) {
      return response.json({ success: false, message: error.message })
    }
  }

  async changePasword({ request, response }) {
    const rules = {
      email: 'email|required',
      code: 'required|min:8|max:8',
      password: 'required|min:4'
    }

    const validation = await validateAll(request.all(), rules, {
      'email.required': 'E-mail é obrigatório',
      'email.required': 'Informe um email válido',
      'code.required': 'Informe o código',
      'code.min': 'Esse código é inválido',
      'code.max': 'Esse código é inválido',
      'password.required': 'A senha é obrigatória',
      'password.min': 'A senha deve ter mais de 4 caracteres',
    })

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const { email, code, password } = request.all()
    const user = await User.query().where({
      email,
      temp_code: code
    })
    .first()

    if (!user) {
      return response.json({ success: false })
    }

    user.password = password

    await user.save()

    return response.json({ success: true })
  }

}

module.exports = LoginController
