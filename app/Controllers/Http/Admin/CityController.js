'use strict'

const City = use('App/Models/City')

class CityController {

  async index({ response, request }) {
    const cities = await City
                          .query()
                          .filter(request.all())
                          .with('state')
                          .paging(request.all())

    return response.json(cities)
  }

  async show({ response, params }) {
    const city = await City.findOrFail(params.id)
    await city.load('state')

    return response.json(city)
  }

  async store({ response, request, params }) {
    const data = request.only(['state_id', 'name', 'description', 'observation'])

    data.state_id = params.state_id

    const city = await City.create(data)

    return response.json(city)
  }

  async update({ response, params, request }) {
    const data = request.only(['state_id', 'name', 'description', 'observation'])

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

module.exports = CityController
