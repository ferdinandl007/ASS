/**
 * Created by Ali on 01/04/2017.
 */


var express = require('express');
var router = express.Router();

var config = {
     accountSid :  'ACdec8d74dd965de5b5a55d493e7e1f02e',
     authToken :  'cfb4b446531be14ce03d7d50424b8df5',
     sendingNumber : '+441722580070'
};

var client = require('twilio')(config.accountSid, config.authToken);

module.exports.sendSms = function(to, message) {

    client.messages.create({
        body: message,
        to: to,
        from: config.sendingNumber
        // mediaUrl: 'http://www.yourserver.com/someimage.png'
    }, function(err, data) {
        if (err) {
            console.error('Could not notify administrator');
            console.error(err);
        } else {
            console.log('Administrator notified');
        }
    });
};


var admins = require('../Config/recievers.json');

function formatMessage(errorToReport) {
    return '[This is a test] ALERT! It appears the server is' +
        'having issues. Exception: ' + errorToReport +
        '. Go to: http://newrelic.com ' +
        'for more details.';
};

exports.notifyOnError = function(appError, request, response, next) {
    admins.forEach(function(admin) {
        var messageToSend = formatMessage(appError.message);
        twilioClient.sendSms(admin.phoneNumber, messageToSend);
    });
    next(appError);
};