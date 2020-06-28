const { hooks } = require('@adonisjs/ignitor')
const url = require('url')
const moment = require('moment')

hooks.after.providersBooted(async () => {
  const View = use('View')

  View.global('date', (value) => {
    console.log(value)
    return moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
  })

  View.global('json', (data) => {
    return JSON.stringify(data)
  })

  View.global('thumb', (folder, file, w = '*', h = '') => {
    let path = `/thumb?src=${folder}&f=${file}&w=${w}`;
    if (h) {
      path += `&h=${h}`
    }
    return path
  })

  View.global('active', function (status, label_success = 'Ativo', label_inactive = 'Inativo') {

    if (status == 1) {
      return this.safe(`<span class="badge badge-success">${label_success}</span>`)
    }

    return this.safe(`<span class="badge badge-danger">${label_inactive}</span>`)
  })

  View.global('addCrumb', function (name, link = null) {
    if (!link) {
      return this.safe(`<li class="breadcrumb-item active">${name}</li>`)
    }
    return this.safe(`<li class="breadcrumb-item"><a href="${link}">${name}</a></li>`)
  })

  View.global('sortablelink', function (name, label, request) {
    const current = url.parse(request.originalUrl())
    const params = new URLSearchParams(current.search)

    let icon = '';
    const sort = params.get('sort')
    let direction = params.get('direction');
    direction = direction && direction.toLowerCase() === 'asc' ? 'desc' : 'asc';

    params.set('direction', direction)

    if (sort === name) {
      iconName = direction == 'asc' ? 'sort-amount-down-alt' : 'sort-amount-up-alt'
      icon = `<i class="fas fa-${iconName}"></i>`
    } else {
      direction = 'asc'
    }

    return this.safe(`
          <a href="?sort=${name}&direction=${direction}">${label} ${icon}</a>
      `)
  })

  View.global('currency', (value) => {
    var value = value.toFixed(2).split('.');
    value[0] = "R$ " + value[0].split(/(?=(?:...)*$)/).join('.');
    return value.join(',');
  })

})
