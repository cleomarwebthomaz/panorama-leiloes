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

Route.group(() => {
  Route.resource('role', 'RoleController').validator('Role')
  Route.resource('user', 'UserController')
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

  Route.resource('auction', 'AuctionController')
  Route.resource('auction.image', 'AuctionImageController')
  Route.resource('auction.bid', 'AuctionBidController')
})
.namespace('Admin')
.prefix('admin/api/v1')

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
  Route.resource('team', 'TeamController')
  Route.resource('auction.bid', 'AuctionBidController').middleware(['auth'])
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
  Route.post('profile/change-password', 'Account/ProfileController.changePassword').middleware(['auth'])
  Route.resource('profile', 'Account/ProfileController').middleware(['auth'])
})
.prefix('api/v1')