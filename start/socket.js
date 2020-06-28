'use strict'

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use('Ws')

Ws.channel('auction', 'AuctionController')
Ws.channel('auctionbid', 'AuctionBindController')
Ws.channel('user', 'UserController')
// .middleware(['auth'])

// Ws.channel('auction', ({ socket }) => {
//   console.log('a new subscription for news topic')

//   socket.on('status', (data) => {
//     // console.log(data)
//     socket.broadcastToAll('status', data)
//   })

// })
