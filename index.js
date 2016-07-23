'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
      event = req.body.entry[0].messaging[i]
      sender = event.sender.id
     /* if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'accounts') {
            sendAccountsMessage(sender)
            continue;
        }
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      } */
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue;
      }
    }
    res.sendStatus(200)
  })

// make this a config variable and move the tiken out of the version control
var token = "EAACVh9jQIckBABZBKFwtQ7tr043ee2ZAkGFq8TZAHj20RxQYZAWZCKBHX18IGHQyGZBfZB0vU9K3y5vO91n67e0RSvPSAhxcT7eUkbLsMqnsNAzZCCxIHZAZBNkHmNUboF38UuhMEvlt2f39H46eVZAzZBdlnUMNUN2oZC0WQXzUM2BZBpZAgZDZD";


function sendTextMessage(sender, text) {
    let messageData = { text:text };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

/* function sendAccountsMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                    "title": "cash accounts",
                    "subtitle": "available balance: $450.57",
                    "buttons": [ {
                        "type": "postback",
                        "title": "details",
                        "payload": "Next bubble with all cash accounts"
                    }
                    ]},
                    {
                         "title": "credit accounts",
                         "subtitle": "available credit: $125,000",
                    "buttons": [ {
                        "type": "postback",
                        "title": "details",
                        "payload": "Next bubble with all credit accounts"
                    }]
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
} */

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})