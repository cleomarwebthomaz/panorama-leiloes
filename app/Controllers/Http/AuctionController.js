const Auction = use('App/Models/Auction')

class AuctionController {

  async index({ response, request }) {
      const actions = await Auction
                                .query()
                                .with('images', (builder) => {
                                  builder.active()
                                })
                                .paging(request.all())

      return response.json(actions)
  }

  async show({ response, params }) {
    const auction = await Auction
                            .query()
                            .where('auctions.id', params.id)
                            .with('images', (builder) => {
                              builder.active()
                            })
                            .first()

    return response.json(auction)
  }

}

module.exports = AuctionController