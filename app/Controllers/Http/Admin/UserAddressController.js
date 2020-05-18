'use strict'

const { validateAll } = use('Validator')

const UserAddress = use('App/Models/UserAddress')

class UserAddressController {

  async index({ response, params, request }) {
    const addresses = await UserAddress
                                .query()
                                .where('user_addresses.user_id', params.user_id)
                                .with('state')
                                .with('city')
                                .with('neighborhood')
                                .paging(request.all())

    return response.json(addresses)
}

  async show({ response, params }) {
    const address = await UserAddress.findOrFail(params.id)
    return response.json(address)
  }

  async store({ response, request, params }) {
    const data = request.only(['state_id', 'city_id', 'neighborhood_id', 'cep', 'name', 'street', 'number', 'complement'])

    data.user_id = params.user_id

    const address = await UserAddress.create(data)

    return response.json(address)
  }

  async update({ response, params, request }) {
    const data = request.only(['state_id', 'city_id', 'neighborhood_id', 'cep', 'name', 'street', 'number', 'complement'])

    const address = await UserAddress.findOrFail(params.id)

    address.merge(data)
    await address.save()

    return response.json(address)
  }

  async destroy({ params }) {
    const address = await UserAddress.findOrFail(params.id)
    await address.delete()
  }


}

module.exports = UserAddressController
