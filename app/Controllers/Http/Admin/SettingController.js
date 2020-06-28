'use strict'

const { validateAll } = use('Validator')
const Setting = use('App/Models/Setting')

class SettingController {

  async index({ view, request }) {
    const settings = await Setting
      .query()
      .filter(request.all())
      .paging(request.all())

    return view.render('admin.pages.setting.index', {
      settings: settings.toJSON()
    })
  }

  async show({ response, params }) {
    const setting = await Setting.findOrFail(params.id)
    return response.json(setting)
  }

  create({ view }) {
    return view.render('admin.pages.setting.create')
  }

  async edit({ view, params }) {
    const setting = await Setting.findOrFail(params.id)
    return view.render('admin.pages.setting.edit', {
      setting: setting.toJSON(),
    })
  }

  async store({ response, request, session }) {
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

    const data = request.only(['name', 'label', 'value', 'public_name', 'observation', 'file', 'folder'])
    await Setting.create(data)

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.setting.index')
  }

  async update({ response, params, request, session }) {
    const data = request.only(['name', 'label', 'value', 'public_name', 'observation', 'file', 'folder'])

    const setting = await Setting.findOrFail(params.id)

    setting.merge(data)
    await setting.save()

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.setting.index')
  }

  async destroy({ params, session, response }) {
    const setting = await Setting.findOrFail(params.id)
    await setting.delete()
    session.flash({ success: 'Registro excluido com sucesso' })
    return response.redirect('back')
  }

}

module.exports = SettingController
