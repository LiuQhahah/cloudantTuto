var http = require('http');
var express = require('express');
var Cloudant = require('@cloudant/cloudant');
var Regex = require("regex");
 var me = 'e5ef7307-8877-4a1a-ad5d-ecc569cfba6d-bluemix'; // Set this to your own account
 var password = '29a34765704aeefa6cd51d760734f6f3043594f4e85c9874927de11789c39f6e';
 var cloudant = Cloudant({account:me, password:password});
var app = express();
 //设置ejs为view引擎
 app.set('view engine','ejs');
 app.use('/assets',express.static('assets'));



//404 response
function send404Response(response){
  response.writeHead(404,{"Content-Type":"text/plgain"});
  response.write("Error 404: Page not found");
  response.end();
}


// app.get('/pin13',function(req,res){
//   db = cloudant.db.use('pin13');
//   db.find({selector:{},limit :1}, function(er, result) {
//     //console.log(JSON.stringify(result));
//     var pin13 = result.docs[0].payload;
//     //console.log("pin13 "+pin13);
//     res.render('pin13',{data:pin13});
//   });
//
// });
// app.get('/',function(req,res){
//   db = cloudant.db.use(dbname);
//   db.find({selector:{deviceId:'IoT2040'},limit :1}, function(er, result) {
//     //console.log(JSON.stringify(result));
//
//     var temp = result.docs[0].payload.d.temp;
//     var humidity  =  result.docs[0].payload.d.humidity;
//     var data = [temp,humidity];
//   //  console.log("temp： "+temp+" , humidity: "+humidity);
//     res.render('index',{data:data});
//   });
//
// });



//get data from data "new2040"
app.get('/iot2040',function(req,res){
  var data = {humidity_data:['',''],temp_data:['',''],history_temp:[],history_humidity:[],status_data:['',''],status:[]};
  db = cloudant.db.use('iot2040');


  // db.find({selector:{"time":{"topic":"time"}},limit : 5},function(err,result){
  //   if (err) {
  //       return res.send();
  //   }
  //   //console.log(JSON.stringify(result));
  //   for(i=0;i<result.docs.length;i++){
  //       //2018-04-13T08:20:29.729Z
  //     data.time[i] = JSON.stringify(result.docs[i].time.payload).slice(12,20);
  //     console.log(data.time[i]);
  //   }
  // });

  //
  // //get real temp
  //
  // db.find({selector:{"temp":{"topic":"temp"}},limit :1},function(err,result){
  //   if (err) {
  //       return res.send();
  //   }
  //   //console.log(JSON.stringify(result));
  //   data.real_temp = result.docs[0].temp.payload;
  //   data.
  //   console.log(data.real_temp);
  // //res.render('iot2040',{real_temp:real_temp});
  // });

  // db.find({selector:{"humidity":{"topic":"humidity"}},limit :1},function(err,result){
  //   if (err) {
  //       return res.send();
  //   }
  //   //console.log(JSON.stringify(result));
  //   data.real_humidity = result.docs[0].humidity;
  //   data.humidity_time = result.docs[0].humidity_time;
  //   console.log(data.real_humidity);
  // //res.render('iot2040',{real_temp:real_temp});
  // });


  // db.find({selector:{"humidity":{"topic":"humidity"}},limit:5},function(err,result){
  //   if (err) {
  //     return res.send();
  //   }
  //
  //
  // });

  //get history temp
  //var history_temp = [];
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
   "limit":20,
   "sort": [
      {
         "_id": "desc"
      }
   ]
},function(err,result){
    if (err) {
        return res.send();
    }
   //console.log(JSON.stringify(result));
    for (var i = 0; i < result.docs.length; i++) {

      data.history_humidity[i] = result.docs[i].humidity;
      data.humidity_data[i]  =result.docs[i].humidity_data.slice(16,25); ;
      console.log("humidity_data: "+data.history_humidity[i]+", humidity_data: "+data.humidity_data[i]);
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
 "limit":20,
 "sort": [
    {
       "_id": "desc"
    }
 ]
},function(err,result){
  if (err) {
      return res.send();
  }
 //console.log(JSON.stringify(result));
  for (var i = 0; i < result.docs.length; i++) {

    data.status[i] = result.docs[i].status;
    data.status_data[i]  =result.docs[i].status_data.slice(16,25); ;
    console.log("status "+data.status[i]+", status_data: "+data.status_data[i]);
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
   "limit":20,
   "sort": [
      {
         "_id": "desc"
      }
   ]
},function(err,result){
    if (err) {
        return res.send();
    }
  //  console.log(JSON.stringify(result));
    for (var i = 0; i < result.docs.length; i++) {

      data.history_temp[i] = result.docs[i].temp;
      data.temp_data[i]  = JSON.stringify(result.docs[i].temp_data).slice(16,25);
      console.log("temp_data : "+data.history_temp[i]+", temp_data:"+data.temp_data[i]);
    }

    res.render('iot2040',{data:data});
  });
});

app.listen(3000);
console.log("Read data ....");
