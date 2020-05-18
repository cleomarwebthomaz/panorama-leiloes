'use strict'

const Page = use('App/Models/Page')
const { validateAll } = use('Validator')

class PageController {

  async index({ response, request }) {
    const pages = await Page
                          .query()
                          .filter(request.all())
                          .paging(request.all())

    return response.json(pages)
  }

  async show({ response, params }) {
    const page = await Page.findOrFail(params.id)
    return response.json(page)
  }

  async store({ response, request }) {
    const rules = {
      title: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['title', 'content', 'active'])

    const page = await Page.create(data)

    return response.json({ success: true, data: page })
  }

  async update({ response, params, request }) {
    const rules = {
      title: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['title', 'content', 'active'])

    const page = await Page.findOrFail(params.id)

    page.merge(data)
    await page.save()

    return response.json(page)
  }

  async destroy({ params }) {
    const page = await Page.findOrFail(params.id)
    await page.delete()
  }

}

module.exports = PageController
