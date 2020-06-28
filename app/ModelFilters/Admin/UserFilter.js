'use strict'

const ModelFilter = use('ModelFilter')

class AdminUserFilter extends ModelFilter {

  id(id) {
    return this.where('id', Number(id))
  }

  email(value) {
    return this.where('email', 'LIKE', `%${value}%`)
  }

  search(search) {
    this.where(function () {
      this.where('id', 'LIKE', `%${search}%`)
        .orWhere('name', 'LIKE', `%${search}%`)
        .orWhere('lastname', 'LIKE', `%${search}%`)
        .orWhere('email', 'LIKE', `%${search}%`)
    })
  }

  userState(user_state_id) {
    return this.where('user_state_id', Number(user_state_id))
  }

}

module.exports = AdminUserFilter
