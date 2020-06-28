'use strict'

const Ws = use('Ws')
const moment = require('moment')

const File = use('App/Services/File')

const Auction = use('App/Models/Auction')
const AuctionBid = use('App/Models/AuctionBid')
const AuctionService = use('App/Services/Auction')

const { validateAll } = use('Validator')

class AuctionController {

  async online({ view, request, response }) {
    const currentOn = await Auction
      .query()
      .where('opened', true)
      .select('id')
      .first()

    if (currentOn) {
      return response.route('admin.online.show', {
        id: currentOn.id
      })
    }

    const auctions = await Auction
      .query()
      .where({
        active: true,
        opened: false
      })
      .where('date', moment().format('YYYY-MM-DD'))
      .filter(request.all())
      .paging(request.all())

    const date = new moment().format('DD/MM/YYYY')

    return view.render('admin.pages.auction.online', {
      auctions: auctions.toJSON(),
      date
    })
  }

  async onlineShow({ params, view }) {
    const auction = await AuctionService.online(params.id)
    const ranks = await AuctionService.getRank(params.id)
    let winner = await AuctionService.getWinner(auction)
    if (winner) winner = winner.toJSON()

    return view.render('admin.pages.auction.show', {
      auction: auction.toJSON(),
      ranks: ranks.toJSON(),
      winner
    })
  }

  async index({ view, request }) {
    const auctions = await Auction
      .query()
      .filter(request.all())
      .withCount('images', (builder) => {
        builder.active()
      })
      .withCount('bids')
      .paging(request.all())

    return view.render('admin.pages.auction.index', {
      auctions: auctions.toJSON()
    })
  }

  async makeOnline({ response, params }) {
    const auction = await AuctionService.makeOnline(params.id)
    return response.route('admin.online.show', {
      id: auction.id,
    })
  }

  async makeFinish({ response, request, params, session }) {
    const winner_id = request.get().winner_id
    await AuctionService.makeFinish(params.id, winner_id)
    session.flash({ success: 'Leilão encerrado com sucesso!' })
    return response.redirect('back')
  }

  async show({ params, view }) {
    let auction = await AuctionService.online(params.id)
    const ranks = await AuctionService.getRank(params.id)
    let winner = await AuctionService.getWinner(auction)
    if (winner) winner = winner.toJSON()

    auction = auction.toJSON()

    auction.date = moment(auction.date).format('DD/MM/YYYY')

    return view.render('admin.pages.auction.show', {
      auction,
      ranks: ranks.toJSON(),
      winner
    })
  }

  async create({ view }) {
    return view.render('admin.pages.auction.create')
  }

  async edit({ view, params }) {
    const auction = await Auction.findOrFail(params.id)
    await auction.load('images', (builder) => {
      builder.orderBy('auction_images.id', 'desc')
    })

    auction.bid_initial = this.currency(auction.bid_initial)

    return view.render('admin.pages.auction.edit', {
      auction: auction.toJSON(),
    })
  }

  currency = (value) => {
    var value = value.toFixed(2).split('.');
    value[0] = "R$ " + value[0].split(/(?=(?:...)*$)/).join('.');
    return value.join(',');
  }

  async store({ response, request, session }) {
    const rules = {
      title: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['title', 'bid_initial', 'description', 'date', 'hour', 'content', 'active', 'opened'])
    data.opened = !!data.opened
    data.active = !!data.active

    const file = request.file('image', { types: ['image'], size: '2mb' })
    if (file) {
      data.image = await File.upload(file, 'uploads/auction')
    }

    let bid_initial = data.bid_initial.replace('.', '')
    bid_initial = bid_initial.replace(',', '.')
    bid_initial = bid_initial.replace('R$', '')
    bid_initial = bid_initial.replace(' ', '')
    data.bid_initial = parseFloat(bid_initial)

    const auction = await Auction.create(data)

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.auction.edit', {
      id: auction.id,
      tab: 'tab-photo'
    })
  }

  async update({ response, params, request, session }) {
    const rules = {
      title: 'required',
    }

    const validation = await validateAll(request.all(), rules, {
      'title.required': 'Informe o título',
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
      return response.redirect('back')
    }

    const data = request.only(['title', 'bid_initial', 'description', 'date', 'hour', 'content', 'active', 'opened'])
    data.opened = !!data.opened
    data.active = !!data.active

    // data.hour = data.hour += ':00'

    const auction = await Auction.findOrFail(params.id)
    const file = request.file('image', { types: ['image'], size: '2mb' })

    if (file && auction.image) {
      File.remove(`uploads/auction/thumbs/${auction.image}`)
      File.remove(`uploads/auction/${auction.image}`)
    }

    if (file) {
      data.image = await File.upload(file, 'uploads/auction')
    }

    let bid_initial = data.bid_initial.replace('.', '')
    bid_initial = bid_initial.replace(',', '.')
    bid_initial = bid_initial.replace('R$', '')
    bid_initial = bid_initial.replace(' ', '')
    data.bid_initial = parseFloat(bid_initial)

    auction.merge(data)
    await auction.save()

    // const auctionUpdaded = await AuctionService.getAuction(auction.id)
    // const topic = Ws.getChannel('auction').topic('auction')
    // topic.broadcastToAll('status', {
    //   auction: auctionUpdaded
    // })

    session.flash({ success: 'Salvo com sucesso' })
    return response.route('admin.auction.index')
  }

  async destroy({ params, response, session }) {
    const auction = await Auction.findOrFail(params.id)
    await auction.load('images')

    if (auction.image) {
      File.remove(`uploads/auction/thumbs/${auction.image}`)
      File.remove(`uploads/auction/${auction.image}`)
    }

    const row = auction.toJSON()

    row.images.forEach(image => {
      if (image.image) {
        File.remove(`uploads/auction-image/thumbs/${image.image}`)
        File.remove(`uploads/auction-image/${image.image}`)
      }
    })

    await auction.delete()

    session.flash({ success: 'Registro excluido com sucesso' })
    return response.redirect('back')
  }

}

module.exports = AuctionController
