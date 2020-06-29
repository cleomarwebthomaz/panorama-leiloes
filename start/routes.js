'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const Helpers = use('Helpers')

const Thumbnail = use('App/Services/Thumbnail')

Route.any('thumb', async ({ response, request }) => {
  return await Thumbnail.cropUrl({ request, response })
});

Route.get('/admin', async ({ auth, response }) => {
  if (!await auth.user) {
    return response.redirect('/admin/login')
  }
  
  return response.redirect('/admin/auction-online')
})

Route.group(() => {
  Route.post('user-make/:id', 'UserController.makeActive').as('user.makeActive')

  Route.resource('dashboard', 'DashboardController')

  Route.resource('push', 'PushNotificationController')
  Route.resource('role', 'RoleController').validator('Role')
  Route.resource('user', 'UserController')
  Route.get('user-approve', 'UserController.approve')
  Route.resource('user.address', 'UserAddressController')
  Route.resource('user-state', 'UserStateController')
  Route.resource('user.contact', 'UserContactController')
  Route.resource('contact-type', 'ContactTypeController')

  Route.resource('state', 'StateController')
  Route.resource('state.city', 'StateCityController')
  Route.resource('city', 'CityController')
  Route.resource('setting', 'SettingController')

  Route.resource('category', 'CategoryController')
  Route.resource('team', 'TeamController')
  Route.resource('page', 'PageController')
  Route.resource('schedule', 'ScheduleController')

  Route.get('auction-online', 'AuctionController.online').as('auction.online')
  Route.get('auction-online/:id', 'AuctionController.onlineShow').as('online.show')

  Route.resource('auction', 'AuctionController')
  Route.resource('auction.image', 'AuctionImageController')
  Route.resource('auction.bid', 'AuctionBidController')

  Route.get('/auction/make-online/:id', 'AuctionController.makeOnline').as('auction.makeOnline')
  Route.get('/auction/make-finish/:id', 'AuctionController.makeFinish').as('auction.makeFinish')

  Route.get('/logout', 'UserController.logout').as('logout')

})
  .namespace('Admin')
  .prefix('admin')
  .as('admin')
  .middleware(['auth:session', 'is:(administrator)'])

  Route.group(() => {
    Route.resource('login', 'LoginController').only(['index', 'store'])
  })
  .prefix('admin')
  .namespace('Admin/Auth')
  .as('admin')

Route.group(() => {
  Route.post('login', 'Auth/LoginController.store')
})
  .prefix('admin/api/v1')
  .namespace('Admin')

Route.get('/auction-image/:path', ({ params, response }) => {
  return response.download(Helpers.tmpPath(`uploads/auction/photos/${params.path}`))
})

Route.group(() => {
  Route.resource('auction', 'AuctionController')
  Route.get('schedule', 'AuctionController.schedule')
  Route.resource('team', 'TeamController')
  Route.resource('auction.bid', 'AuctionBidController').middleware(['auth:jwt'])
  Route.get('auction/:auction_id/bid-total', 'AuctionBidController.getTotal')
  Route.get('auction-current', 'AuctionCurrentController.index')
  Route.get('setting', 'SettingController.index')
  Route.resource('page', 'PageController')
  Route.resource('state', 'StateController')
  Route.resource('state.city', 'StateCityController')

  Route.resource('login', 'Auth/LoginController')
  Route.resource('register', 'Auth/RegisterController')
  Route.resource('forgot-password', 'Auth/ForgotPasswordController')
  Route.post('change-password', 'Auth/ForgotPasswordController.changePasword')

  // Auth
  Route.post('request', 'Account/ProfileController.request').middleware(['auth:jwt'])
  Route.post('profile/change-password', 'Account/ProfileController.changePassword').middleware(['auth:jwt'])
  Route.resource('profile', 'Account/ProfileController').middleware(['auth:jwt'])
})
  .prefix('api/v1')