'use strict'

const UserContact = use('App/Models/UserContact')

class UserContactController {

	async index({ response, params, request }) {
	    const contacts = await UserContact
                                  .query()
                                  .where('user_contacts.user_id', params.user_id)
                                  .with('type')
                                  .paging(request.all())

	    return response.json(contacts)
	}

    async show({ response, params }) {
	    const option = await UserContact.findOrFail(params.id)
	    return response.json(option)
    }

    async store({ response, request, params }) {
      const data = request.only(['contact_type_id', 'contact_name', 'value', 'observation'])

      data.favorite = !!data.favorite
      data.user_id = params.user_id

	    const option = await UserContact.create(data)

	    return response.json(option)
    }

    async update({ response, params, request }) {
	    const data = request.only(['contact_type_id', 'contact_name', 'value', 'observation'])

      data.favorite = !!data.favorite

	    const option = await UserContact.findOrFail(params.id)

	    option.merge(data)
	    await option.save()

	    return response.json(option)
    }

    async destroy({ params }) {
	    const option = await UserContact.findOrFail(params.id)
	    await option.delete()
    }

}

module.exports = UserContactController
