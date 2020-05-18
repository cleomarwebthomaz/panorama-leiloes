'use strict'

const Team = use('App/Models/Team')

class TeamController {

	async index({ response, params, request }) {
	    const teams = await Team
                            .query()
                            .paging(request.all())

	    return response.json(teams)
	}

}

module.exports = TeamController
