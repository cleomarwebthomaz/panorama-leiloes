'use strict'

const Page = use('App/Models/Page')

class PageCurrentController {

  async index({ response, request }) {
    const pages = await Page
      .query()
      // .filter(request.all())
      .where('show_list', true)
      .fetch()

    return response.json(pages)
  }

  async show({ response, params }) {
    const page = await Page.findOrFail(params.id)
    return response.json(page)
  }

}

module.exports = PageCurrentController
