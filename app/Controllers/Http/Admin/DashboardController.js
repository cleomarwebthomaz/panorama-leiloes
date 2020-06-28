'use strict'

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// const AuctionBid = use('App/Models/AuctionBid')

class DashboardController {

  async index({ view }) {

    // return 'fewnio'
    return view.render('admin.pages.dashboard.index')
  }

}

module.exports = DashboardController

