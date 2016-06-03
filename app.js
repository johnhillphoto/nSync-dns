var keys = require('./keys.js');
var keyId = keys.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
var secretKey = keys.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
var bucket = keys.S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;
var express = require('express');
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: keyId, secretAccessKey: secretKey});
// var bodyParser = require('body-parser');
var path = require('path');
var awsPromised = require('aws-promised');
var s3 = awsPromised.s3();

var app = express();

app.get('/', function(req, res, next){
  var s3Params = {
      Bucket: bucket,
      Key: 'address.txt'
  };
  s3.getObjectPromised(s3Params)
  .then(function(data){
    var addressNum = data.Body.toString('utf8');
    console.log("sent back",addressNum);
    res.send(addressNum);
  })
  .catch(console.error);
});

app.put('/', function(req, res, next){

  var s3bucket = new AWS.S3({params: {Bucket: bucket}});
  s3bucket.createBucket(function() {
    var params = {Key: 'address.txt', Body: req.query.photo_serve};
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("Error uploading data: ", err);
      } else {
          res.send('Address Written');
        console.log("Successfully uploaded", req.query.photo_serve);
      }
    });
  });
});

module.exports = app;
