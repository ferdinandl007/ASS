var express = require('express');
var router = express.Router();

var twillio = require('./twililio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sendmessage', function(req, res, next) {

    twillio.sendSms('+447589600800', "hey whats up");
    res.send('Successgully sent');
});

module.exports = router;
