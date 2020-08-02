'use strict';

console.log('Loading function');
var WechatAPI = require('wechat-api');

var appid = process.env.APP_ID;
var appsecret = process.env.APP_SECRET;
var template_id = process.env.TEMPLATE_ID;
var api = new WechatAPI(appid, appsecret);

exports.lambda_handler = (event, context, callback) => {
    console.log(event);

    var endpoints = Object.keys(event['Endpoints']);
    endpoints.forEach(endpoint => {
        var endpoint_profile = event['Endpoints'][endpoint];
        // the endpoint profile contains the entire endpoint definition.

        var address = endpoint_profile['Address'];
        // the address is the identifier for a personal WeChat account, e.g. oyr2L1k0VxhnbhQsuc6jUZ_n6v4A

        var userAttributes = endpoint_profile['User']['UserAttributes'];
        var url = userAttributes['TeamUrl'][0];
        //customer will be redirected to this url after they click the message

        var body = {
            'firstName': {
                'value': userAttributes['FirstName'][0]
            },
            'teamName': {
                'value': userAttributes['TeamName'][0]
            }

        }
        //request body which contains data to be put into the template

        api.sendTemplate(address, template_id, url, body, function (err, res) {
            if (err) return console.error(err);
            console.log(JSON.stringify(res));
        });

    });

    callback(null, event);
};
