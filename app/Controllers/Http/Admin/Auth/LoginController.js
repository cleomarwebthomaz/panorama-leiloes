'use strict'

const { validateAll } = use('Validator')

class LoginController {

	async index({ view }) {
		return view.render('admin.pages.auth.login')
  }
  
	async store({ request, auth, response, session }) {
    try {
      const rules = {
        email: 'required|email',
        password: 'required'
      }

      const validation = await validateAll(request.all(), rules, {
        'email.required': 'Informe seu email',
        'email.email': 'Informe um email válido',
        'password.required': 'Informe sua senha de acesso',
      })

      if (validation.fails()) {
        session
        .withErrors(validation.messages())
        .flashExcept(['password'])
    
        return response.redirect('back')
      }

      const { email, password, remember } = request.all();

      if (await auth.user) {
        await auth.logout()
      }

      await auth.remember(remember == 'on' ? true : false).attempt(email, password)

      return response.route('/admin/auction')
    } catch (error) {
      console.log(error)
      session.flash({ error: 'Email ou senha inválidos' })
      return response.redirect('back')
    }    
	}


}

module.exports = LoginController
