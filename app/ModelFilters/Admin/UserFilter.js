'use strict'

const ModelFilter = use('ModelFilter')

class AdminUserFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  email(value) {
    return this.where('email', 'LIKE', `%${value}%`)
  }

  search(value) {
    return this.where('name', 'LIKE', `%${value}%`)
  }

  userState(user_state_id) {
    return this.where('user_state_id', Number(user_state_id))
  }

}

module.exports = AdminUserFilter
