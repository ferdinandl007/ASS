var express = require('express');
var router = express.Router();

var twillio = require('./twililio');
var recievers = require('../Config/recievers.json');
var Location = require('../Model/Location');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sendmessage', function(req, res, next) {

    var loc = new Location({
        longitude: 101.22,
        latitude : 211.2112
    });

    var messsage = 'Please rescue at ' + 'logitiude: ' + loc.longitude + ' \n' + 'latituide: ' + loc.latitude + '\n' + 'Thanks';

    recievers.forEach(function (pn) {
        console.log('pn is:', pn);
        twillio.sendSms(pn, messsage);

    })
    res.send('Successgully sent');
});

module.exports = router;
