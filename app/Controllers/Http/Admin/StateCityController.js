'use strict'

const City = use('App/Models/City')

class StateCityController {

	async index({ response, params, request }) {
	    const cities = await City
                                .query()
                                .where('cities.state_id', params.state_id)
                                .paging(request.all())

	    return response.json(cities)
	}

    async show({ response, params }) {
	    const city = await City.findOrFail(params.id)
	    return response.json(city)
    }

    async store({ response, request, params }) {
      const data = request.only(['name'])

      data.state_id = params.state_id

	    const city = await City.create(data)

	    return response.json(city)
    }

    async update({ response, params, request }) {
	    const data = request.only(['name'])

	    const city = await City.findOrFail(params.id)

	    city.merge(data)
	    await city.save()

	    return response.json(city)
    }

    async destroy({ params }) {
	    const city = await City.findOrFail(params.id)
	    await city.delete()
    }

}

module.exports = StateCityController
