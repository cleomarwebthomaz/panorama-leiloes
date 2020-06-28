'use strict'

const { validateAll } = use('Validator')

class PushNotificationController {

  async index({ view, session }) {
    session.flash({ success: 'Push enviado com sucesso' })

    return view.render('admin.pages.push.create')
  }

  async create({ view }) {
    return view.render('admin.pages.push.create')
  }

  async store({ response, request, session }) {
    const rules = {
      title: 'required',
      subtitle: 'required',
      content: 'required',
    }

    const validation = await validateAll(request.all(), rules, {
      'title.required': 'Esse campo é obrigatório',
      'subtitle.required': 'Esse campo é obrigatório',
      'content.required': 'Esse campo é obrigatório',
    })

    if (validation.fails()) {
      return response.json({ errors: validation.messages(), success: false })
    }

    const data = request.only(['title', 'name', 'subtitle', 'content'])

    var sendNotification = function(data) {
      var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic NjUxYjViODEtZWYwNi00NTc4LWE0OWYtNTJiYzM2NTFmMjkw"
      };
      
      var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
      };
      
      var https = require('https');
      var req = https.request(options, function(res) {  
        res.on('data', function(data) {
          console.log("Response:");
          console.log(JSON.parse(data));
        });
      });
      
      req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
      });
      
      req.write(JSON.stringify(data));
      req.end();
    };

    var message = { 
      app_id: "33743e23-81bb-4f39-9d2f-449210ba41d9",
      headings: {
        "pt": data.title,
        "en": data.title,
      },
      subtitle: {
        "pt": data.subtitle,
        "en": data.subtitle,
      },
      contents: {
        "pt": data.content,
        "en": data.content,
      },
      included_segments: ["All"]
    };
    
    sendNotification(message);

    session.flash({ success: 'Notificação Push enviado com sucesso' })

    return response.redirect('back')
  }

}

module.exports = PushNotificationController
