try {
    var keys = require('./keys.js');
}
catch (e) {
        console.log(e);
}
var keyId = process.env.AWS_ACCESS_KEY_ID || keys.AWS_ACCESS_KEY_ID;
var secretKey = process.env.AWS_SECRET_ACCESS_KEY || keys.AWS_SECRET_ACCESS_KEY;
var bucket = process.env.S3_BUCKET_NAME || keys.S3_BUCKET_NAME;
var express = require('express');
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: keyId, secretAccessKey: secretKey});
var awsPromised = require('aws-promised');
var s3 = awsPromised.s3();

var app = express();

var dataObject = {photoIP: '0.0.0.0.p', socketIP: '0.0.0.0.s'};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// app.use(cors());


app.get('/', function(req, res, next){
  var s3Params = {
      Bucket: bucket,
      Key: 'address.json'
  };
  s3.getObjectPromised(s3Params)
  .then(function(data){
    var addressNums = data.Body.toString('utf8');
    console.log("sent back",addressNums);
    res.send(addressNums);
  })
  .catch(console.error);
});

function saveBucket(res, type){
  var s3bucket = new AWS.S3({params: {Bucket: bucket}});
  s3bucket.createBucket(function() {
    var params = {Key: 'address.json', Body: JSON.stringify(dataObject), ContentType: 'application/json'};
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("Error uploading data: ", err);
      } else {
          res.send(type + ' Address Written');
        console.log(type +" IP Successfully uploaded");
      }
    });
  });
}//end saveBucket

app.post('/photo', function(req, res, next){
  dataObject.photoIP =req.query.photoIP;
  saveBucket(res, 'Photo');
});//end photo put

app.post('/socket', function(req, res, next){
  dataObject.socketIP =req.query.socketIP;
  saveBucket(res, 'Socket');
});//end socket put

module.exports = app;
