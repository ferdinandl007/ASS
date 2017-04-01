var express = require('express');
var router = express.Router();

var twillio = require('./twililio');
var recievers = require('../Config/recievers.json');
var Location = require('../Model/Location');

var watson = require('watson-developer-cloud');
var fs = require('fs');

var visual_recognition = watson.visual_recognition({
    api_key: '9be213bceee345ed33febf2124ed5a920db946d6',
    version: 'v3',
    version_date: '2016-05-20'
});

var params = {
    images_file: fs.createReadStream( __dirname +"/scene00001.jpg"),
    classifier_ids: ['person1_2003340273']
};





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sendmessage', function(req, res, next) {


    res.send('Successgully sent');
});

router.get('/watson',function (req, res, next) {
    sendToWatson(function (flag) {

        if(flag) {
            var loc = new Location({
                longitude: 101.22,
                latitude : 211.2112
            });

            var messsage = 'Please rescue at ' + 'logitiude: ' + loc.longitude + ' \n' + 'latituide: ' + loc.latitude + '\n' + 'Thanks';

            recievers.forEach(function (pn) {
                console.log('pn is:', pn);
                twillio.sendSms(pn, messsage);

            })

        } else {

        }
    });
    res.send('sent000');

})

function sendToWatson(callback){
    console.log("send to watson ");
    visual_recognition.classify(params, function(err, res) {
        if (err)
            console.log(err);
        else{
           // console.log(JSON.stringify(res, null, 2));
            console.log(res.images[0].classifiers[0].classes[0].score);
            var score = res.images[0].classifiers[0].classes[0].score;
            if(score > 0.45){
                callback(true)
            }

        }
    });

}

module.exports = router;
