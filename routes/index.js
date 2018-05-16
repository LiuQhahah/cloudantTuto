var express = require('express');
var router = express.Router();
var fs = require('fs');


var Cloudant = require('@cloudant/cloudant');

var me = 'e5ef7307-8877-4a1a-ad5d-ecc569cfba6d-bluemix'; // Set this to your own account
var password = '29a34765704aeefa6cd51d760734f6f3043594f4e85c9874927de11789c39f6e';
var cloudant = Cloudant({ account: me, password: password });

//get data from data "new2040"
router.get('/index', function (req, res) {
  var reveive_data = { humidity_data: ['', ''], temp_data: ['', ''], history_temp: [], history_humidity: [], status_data: ['', ''], status: [] };
  db = cloudant.db.use('iot2040');


 
  db.find({
    "selector": {
      "topic": {
        "$eq": "humidity"
      }
    },
    "fields": [
      "_id",
      "humidity",
      "humidity_data",
      "topic"
    ],
    "limit": 20,
    "sort": [
      {
        "_id": "desc"
      }
    ]
  }, function (err, result) {
    if (err) {
      return res.send();
    }
    //console.log(JSON.stringify(result));
    for (var i = 0; i < result.docs.length; i++) {

      reveive_data.history_humidity[i] = result.docs[i].humidity;
      reveive_data.humidity_data[i] = result.docs[i].humidity_data.slice(16, 25);;
      console.log("humidity_data: " + reveive_data.history_humidity[i] + ", humidity_data: " + reveive_data.humidity_data[i]);
    }


  });


  //get pin13 status

  db.find({
    "selector": {
      "topic": {
        "$eq": "status"
      }
    },
    "fields": [
      "_id",
      "status",
      "status_data",
      "topic"
    ],
    "limit": 20,
    "sort": [
      {
        "_id": "desc"
      }
    ]
  }, function (err, result) {
    if (err) {
      return res.send();
    }
    //console.log(JSON.stringify(result));
    for (var i = 0; i < result.docs.length; i++) {

      reveive_data.status[i] = result.docs[i].status;
      reveive_data.status_data[i] = result.docs[i].status_data.slice(16, 25);;
      console.log("status " + reveive_data.status[i] + ", status_data: " + reveive_data.status_data[i]);
    }


  });

  //get temp
  db.find({
    "selector": {
      "topic": {
        "$eq": "temp"
      }
    },
    "fields": [
      "_id",
      "temp",
      "temp_data",
      "topic"
    ],
    "limit": 20,
    "sort": [
      {
        "_id": "desc"
      }
    ]
  }, function (err, result) {
    if (err) {
      return res.send();
    }
    //  console.log(JSON.stringify(result));
    for (var i = 0; i < result.docs.length; i++) {

      reveive_data.history_temp[i] = result.docs[i].temp;
      reveive_data.temp_data[i] = JSON.stringify(result.docs[i].temp_data).slice(16, 25);
      console.log("temp_data : " + reveive_data.history_temp[i] + ", temp_data:" + reveive_data.temp_data[i]);
    }
   

    //res.send(reveive_data);
    //只有页面刷新一遍，才执行此get
    res.render('index', { send_data: reveive_data });
   
   
  });


});




module.exports = router;
