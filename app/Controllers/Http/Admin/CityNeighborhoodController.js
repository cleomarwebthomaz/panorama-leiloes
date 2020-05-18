'use strict'

const Neighborhood = use('App/Models/Neighborhood')

class NeighborhoodController {

	async index({ response, params, request }) {
	    const neighborhood = await Neighborhood
                                  .query()
                                  .where('city_id', params.city_id)
                                  .paging(request.all())

	    return response.json(neighborhood)
	}

    async show({ response, params }) {
	    const neighborhood = await Neighborhood.findOrFail(params.id)
	    return response.json(neighborhood)
    }


    async store({ response, request, params }) {
      const data = request.only(['name', 'price', 'description'])

      data.city_id = params.city_id

	    const neighborhood = await Neighborhood.create(data)

	    return response.json(neighborhood)
    }

    async update({ response, params, request }) {
	    const data = request.only(['name', 'price', 'description'])

	    const neighborhood = await Neighborhood.findOrFail(params.id)

	    neighborhood.merge(data)
	    await neighborhood.save()

	    return response.json(neighborhood)
    }

    async destroy({ params }) {
	    const neighborhood = await Neighborhood.findOrFail(params.id)
	    await neighborhood.delete()
    }

}

module.exports = NeighborhoodController
