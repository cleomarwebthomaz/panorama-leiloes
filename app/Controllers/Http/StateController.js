'use strict'

const State = use('App/Models/State')

class StateController {

	async index({ response, request }) {
	    const states = await State
                            .query()
                            .filter(request.all())
                            .fetch()

	    return response.json(states)
  }

}

module.exports = StateController
