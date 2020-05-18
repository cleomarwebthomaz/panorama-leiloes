'use strict'

class LoginController {

  async store({ auth, response, request }) {
    try {
      const { email, password } = request.all()
      const userAuth = await auth.attempt(email, password)
  
      const user = await user.findBy('email', email)
  
     return response.json({
      user,
      token: userAuth.token
     })
    } catch (error) {
      return response.json({ success: false, message: error.message })
    }
  }

}

module.exports = LoginController
