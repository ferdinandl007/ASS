var express = require('express');
var router = express.Router();

var twillio = require('./twililio');
var recievers = require('../Config/recievers.json');
var Location = require('../Model/Location');

var watson = require('watson-developer-cloud');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var aws = require('aws-sdk');

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
           console.log(JSON.stringify(res, null, 2));
            //console.log(res.images[0].classifiers[0].classes[0].score);
            /*var score = res.images[0].classifiers[0].classes[0].score;
            if(score > 0.45){
                callback(true)
            }*/

        }
    });

}
const S3_BUCKET = 'imagesuploadjs' //= process.env.S3_BUCKET;

// Create S3 service object
//s3 = new AWS.S3({apiVersion: '2006-03-01'});

var s3 = new aws.S3({
    sslEnabled: true,
    accessKeyId: "AKIAINT4DVSPUNN7MQOA",
    secretAccessKey: "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"

});

function uploadFile(file, fileName, callback){

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: S3_BUCKET, Key: '', Body: '',  ACL: 'public-read'};

    // call S3 to retrieve upload file to specified bucket
    uploadParams.Body = new Buffer(file);
    //var u = id.get();

    uploadParams.Key = fileName;

    s3.upload (uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
            callback(data.Location);
            //return data;
        }
    });


}

router.post('/postimage1',  function (req, res) {


        console.log('POST request received for:', req.get('host')+req.url) ;
        req.pipe(req.busboy);


        req.busboy.on('field', function (fieldname, val) {
            console.log('form field:', fieldname);
            console.log("value:", val);

        });
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
            file.on('data', function(data){
                uploadFile(data, filename, function(url) {
                    console.log("done" + url);
                    //res.json({success:true, URL: url});
                    params.images_file = null;
                    params.url = url;
                    sendToWatson(function (flag) {
                        console.log('herrlo tgeree');
                    });
                });

            })
        });




    /*  sendToWatson(function (flag) {
          console.log('some');

      })*/
    res.send('thanjs');


});
module.exports = router;
