'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Page = use('App/Models/Page')

/**
 * Resourceful controller for interacting with pages
 */
class PageController {
  /**
   * Show a list of all pages.
   * GET pages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, view }) {
    const page = request.get().page || 1

    const pages = await Page
      .query()
      .sortable(request)
      .filter(request.all())
      .orderBy('id', 'desc')
      .paginate(page)

    return view.render('admin.pages.cms.index', {
      pages: pages.toJSON(),
    })
  }

  /**
   * Render a form to be used for creating a new page.
   * GET pages/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ view }) {
    return view.render('admin.pages.cms.create')
  }

  /**
   * Create/save a new page.
   * POST pages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session }) {
    const data = request.only(['title', 'content', 'active'])

    data.active = data.active ? true : false

    const page = await Page.create(data)

    if (page) {
      session.flash({ success: 'Página Cadastrada com sucesso.' })
      return response.route('admin.page.index')
    }

    return response.redirect('back')
  }

  /**
   * Display a single page.
   * GET pages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing page.
   * GET pages/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    const page = await Page.findOrFail(params.id)

    return view.render('admin.pages.cms.edit', {
      page: page.toJSON()
    })
  }

  /**
   * Update page details.
   * PUT or PATCH pages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session }) {
    const data = request.only(['title', 'content', 'active'])

    const page = await Page.findOrFail(params.id)

    data.active = data.active ? true : false

    page.merge(data)

    await page.save()

    session.flash({ success: 'Página atualizada com sucesso.' })
    return response.route('admin.page.index')
  }

  /**
   * Delete a page with id.
   * DELETE pages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, session, response }) {
    const page = await Page.findOrFail(params.id)
    await page.delete()

    session.flash({ success: 'Página excluida com sucesso' })
    return response.redirect('back')
  }
}

module.exports = PageController
