'use strict'

const Setting = use('App/Models/Setting')

class SettingCurrentController {

	async index({ response, request }) {
	    const settings = await Setting
															.query()
															.filter(request.all())
                              .first()

	    return response.json(settings)
	}

}

module.exports = SettingCurrentController
