'use strict'

const User = use('App/Models/User')

class LoginController {

  async store({ auth, response, request }) {
    try {
      const { email, password } = request.all()
      const userAuth = await auth.attempt(email, password)
  
      const user = await User.findBy('email', email)

      return response.json({
        success: true,
        user,
        token: userAuth.token
      })
    } catch (error) {
      return response.json({ success: false, message: error.message })
    }
  }

}

module.exports = LoginController
