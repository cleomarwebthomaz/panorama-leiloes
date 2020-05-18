'use strict'

class AuctionBindController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage (message) {
    this.socket.broadcastToAll('message', message)
  }
    
}

module.exports = AuctionBindController