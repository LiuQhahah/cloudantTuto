var http = require('http');
var express = require('express');
var Cloudant = require('@cloudant/cloudant');

 var me = '79f006ec-e65c-4ab0-9280-9d5701534e3f-bluemix'; // Set this to your own account
 var password = '96b9ad0a7aab85772a8d77cc987924d80daedcec8d986a269497aeecf2c311b7';
 var cloudant = Cloudant({account:me, password:password});
var app = express();
 //设置ejs为view引擎
 app.set('view engine','ejs');
 app.use('/assets',express.static('assets'));

var dbname = 'iot2040_1';
var db = null;
var doc = null;
var docs_length = 0;


//404 response
function send404Response(response){
  response.writeHead(404,{"Content-Type":"text/plgain"});
  response.write("Error 404: Page not found");
  response.end();
}


app.get('/pin13',function(req,res){
  db = cloudant.db.use('d13');
  db.find({selector:{topic:'13'},limit :1}, function(er, result) {
    console.log(JSON.stringify(result));
    var pin13 = result.docs[0].payload;
    console.log("pin13 "+pin13);
    res.render('pin13',{data:pin13});
  });

});
app.get('/',function(req,res){
  db = cloudant.db.use(dbname);
  db.find({selector:{deviceId:'IoT2040'},limit :1}, function(er, result) {
    console.log(JSON.stringify(result));

    var temp = result.docs[0].payload.d.temp;
    var humidity  =  result.docs[0].payload.d.humidity;
    var data = [temp,humidity];
    console.log("temp： "+temp+" , humidity: "+humidity);
    res.render('index',{data:data});
  });

});




app.listen(3000);
console.log("Read data ....");
