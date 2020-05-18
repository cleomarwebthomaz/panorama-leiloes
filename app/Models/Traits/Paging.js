'use strict'

class Paging {
  register (Model) {

    Model.queryMacro('paging', function (params) {
      let { order, sort = 'id', limit = 20, page = 1 } = params;

      if (order && sort) {
        this.orderBy(sort, order)
      }

      page = page > 0 ? parseInt(page) : 1
      limit = limit ? parseInt(limit) : 20

      return this.paginate(page, limit)
    })

  }
}

module.exports = Paging
