'use strict'

class Sortable {
  register(Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)

    const sortable = Model.sortable()

    Model.queryMacro('sortable', function (request) {
      var { sort, direction } = request.only(['sort', 'direction'])

      direction = direction == 'asc' ? 'asc' : 'desc'

      if (!sortable.includes(sort)) {
        return this
      }

      this.orderBy(sort, direction)

      return this
    })
  }
}

module.exports = Sortable
