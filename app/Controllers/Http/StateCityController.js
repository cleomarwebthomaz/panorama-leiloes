'use strict'

const State = use('App/Models/State')
const City = use('App/Models/City')

class StateCityController {

	async index({ response, request, params }) {
    // const limit = request.get().limit || 20
    const city = await State.findOrFail(params.state_id);

    const cities = await City
                          .query()
                          .where('state_id', city.id)
                          .limit(99999)
                          .orderBy('name', 'ASC')
                          .fetch()

    return response.json(cities)
  }

}

module.exports = StateCityController
