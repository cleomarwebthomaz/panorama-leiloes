'use strict'

const Setting = use('App/Models/Setting')

class SettingController {

  async index({ response, request }) {
    const settings = await Setting
                          .query()
                          .filter(request.all())
                          .paging(request.all())

    return response.json(settings)
  }

  async show({ response, params }) {
    const setting = await Setting.findOrFail(params.id)
    return response.json(setting)
  }

  async store({ response, request }) {
    const data = request.only(['name', 'label', 'value', 'public_name', 'observation', 'file', 'folder'])

    const setting = await Setting.create(data)

    return response.json(setting)
  }

  async update({ response, params, request }) {
    const data = request.only(['name', 'label', 'value', 'public_name', 'observation', 'file', 'folder'])

    const setting = await Setting.findOrFail(params.id)

    setting.merge(data)
    await setting.save()

    return response.json(setting)
  }

  async destroy({ params }) {
    const setting = await Setting.findOrFail(params.id)
    await setting.delete()
  }

}

module.exports = SettingController
