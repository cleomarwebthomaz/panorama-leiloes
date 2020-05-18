'use strict'

const ContactType = use('App/Models/ContactType')

class ContactTypeController {

  async index({ response, request }) {
    const contactTypes = await ContactType
                                  .query()
                                  .filter(request.all())
                                  .paging(request.all())

    return response.json(contactTypes)
  }

  async show({ response, params }) {
    const contactType = await ContactType.findOrFail(params.id)
    return response.json(contactType)
  }

  async store({ response, request }) {
    const data = request.only(['name', 'observation', 'sort'])

    data.active = !!data.active

    const contactType = await ContactType.create(data)

    return response.json(contactType)
  }

  async update({ response, params, request }) {
    const data = request.only(['name', 'observation', 'sort'])
    data.active = !!data.active

    const contactType = await ContactType.findOrFail(params.id)

    contactType.merge(data)
    await contactType.save()

    return response.json(contactType)
  }

  async destroy({ params }) {
    const contactType = await ContactType.findOrFail(params.id)
    await contactType.delete()
  }

}

module.exports = ContactTypeController
