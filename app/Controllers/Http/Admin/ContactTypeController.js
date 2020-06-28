'use strict'

const { validateAll } = use('Validator')

const ContactType = use('App/Models/ContactType')

class ContactTypeController {

  async index({ view, request }) {
    const contactTypes = await ContactType
      .query()
      .filter(request.all())
      .paging(request.all())

    return view.render('admin.pages.contact-type.index', {
      contactTypes: contactTypes.toJSON()
    })
  }

  async show({ response, params }) {
    const contactType = await ContactType.findOrFail(params.id)
    return response.json(contactType)
  }

  create({ view }) {
    return view.render('admin.pages.contact-type.create')
  }

  async edit({ view, params }) {
    const state = await State.findOrFail(params.id)
    return view.render('admin.pages.contact-type.edit', {
      state: state.toJSON(),
    })
  }

  async store({ response, request }) {
    const rules = {
      name: 'required',
    }

    const validation = await validateAll(request.all(), rules, {
      'name.required': 'Esse campor é obrigatório'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
      return response.redirect('back')
    }

    const data = request.only(['name', 'observation', 'sort'])

    data.active = !!data.active

    await ContactType.create(data)

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.contact-type.index')
  }

  async update({ response, params, request }) {
    const rules = {
      name: 'required',
    }

    const validation = await validateAll(request.all(), rules, {
      'name.required': 'Esse campor é obrigatório'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
      return response.redirect('back')
    }


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
