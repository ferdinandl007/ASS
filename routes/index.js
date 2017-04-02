var express = require('express');
var router = express.Router();

var twillio = require('./twililio');
var recievers = require('../Config/recievers.json');
var Location = require('../Model/Location');

var watson = require('watson-developer-cloud');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var multipartstream = require('multipart-read-stream');
var pump = require('pump');
var http = require('http');


var visual_recognition = watson.visual_recognition({
    api_key: '577febf5f2455d14c15923bd5a7d0d3d5af3aa5b',
    version: 'v3',
    version_date: '2016-05-20'
});

var params = {
    url : '',
    classifier_ids: ['person3_1788983704']
};


router.post('/postdata', function (req, res) {


    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var url = req.body.url;


    params.url = url;


    sendToWatson(function (flag) {

        if(flag) {

            var messsage = 'Please rescue at ' + 'logitiude: ' + longitude + ' \n' + 'latituide: ' + latitude + '\n' + 'Thanks';

            recievers.forEach(function (pn) {
                console.log('pn is:', pn);
                //twillio.sendSms(pn, messsage);
            })
            res.send('All Done');

        } else {
            res.send('Nothing to be done');

        }

    });


});

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



router.post('/postimage1', multipartMiddleware, function (req, res) {

    //params.images_file = req.files.file;

    //params.image = req.files;

    console.log(req.files.file);

    var multipartStream = multipart(req.headers, handler);

    pump(req, multipartStream, function (err) {
        if (err) res.end('server error')
        res.end()
    })

    function handler (fieldname, file, filename) {
        console.log('reading file ' + filename + ' from field ' + fieldname)
        var fileStream = fs.createWriteStream(path.join('/tmp', filename))
        pump(file, fileStream)


    }



  /*  sendToWatson(function (flag) {
        console.log('some');

    })*/
    res.send('thanjs');


})
module.exports = router;
