const { BasePresenter } = require('edge.js')
const url = require('url')

class AdminMenuPresenter extends BasePresenter {

  getMenus() {
    return [
      // {
      //   name: 'Dashboard',
      //   link: '/admin/dashboard',
      //   icon: 'fas fa-tachometer-alt'
      // },
      {
        name: 'Ao Vivo',
        link: '/admin/auction-online',
        icon: 'fas fa-play'
      },
      {
        name: 'Agenda',
        link: '/admin/auction',
        icon: 'fas fa-calendar'
      },
      {
        name: 'Equipe',
        link: '/admin/team',
        icon: 'far fa-user'
      },     
      {
        name: 'Usuários',
        link: '/admin/user',
        icon: 'fa fa-user'
      },
      {
        name: 'Aprovar Usuários',
        link: '/admin/user-approve',
        icon: 'fa fa-users'
      },
      {
        name: 'Páginas',
        link: '/admin/page',
        icon: 'fas fa-file'
      },
      {
        name: 'Configurações',
        link: '#',
        icon: 'fa fa-cog',
        submenu: [
          {
            name: 'Configurações',
            link: '/admin/setting',
          },
          {
            name: 'Estados',
            link: '/admin/state',
          },
          {
            name: 'Cidades',
            link: '/admin/city',
          },
          {
            name: 'Regras de Acesso',
            link: '/admin/role',
          }
        ]
      }
    ]
  }

  isActive(menu, request) {
    const current = url.parse(request.originalUrl())
    const path = current.path

    return menu.link === path
  }

}

module.exports = AdminMenuPresenter
