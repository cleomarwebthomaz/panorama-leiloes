'use strict'

class Paging {
  register(Model) {

    Model.queryMacro('paging', function (params) {
      let { direction, sort = 'id', limit = 20, page = 1 } = params;

      if (!direction) {
        direction = 'desc'
      }

      this.orderBy(sort, direction)

      page = page > 0 ? parseInt(page) : 1
      limit = limit ? parseInt(limit) : 20

      return this.paginate(page, limit)
    })

  }
}

module.exports = Paging
