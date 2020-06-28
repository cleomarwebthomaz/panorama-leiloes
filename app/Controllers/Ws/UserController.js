'use strict'

class UserController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onStatus(message) {
    this.socket.broadcastToAll('message', message)
  }

}

module.exports = UserController
