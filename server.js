var http = require('http')
var fs = require ('fs')


var Cloudant = require('@cloudant/cloudant');



 var me = '79f006ec-e65c-4ab0-9280-9d5701534e3f-bluemix'; // Set this to your own account
 var password = '96b9ad0a7aab85772a8d77cc987924d80daedcec8d986a269497aeecf2c311b7';

 var cloudant = Cloudant({account:me, password:password});

var dbname = 'iot2040_1';
var db = null;
var doc = null;
var docs_length = 0;


var temp_local = 0;
//404 response
function send404Response(response){
  response.writeHead(404,{"Content-Type":"text/plain"});
  response.write("Error 404: Page not found");
  response.end();
}

//Handle a user request
function onRequest(request,response){
  if (request.method=='GET'&&request.url =='/') {
    response.writeHead(200,{"Content-Type":"text/html"});
    //fs.createReadStream("./index.html").pipe(response);
      response.write("temp_local"+temp_local);


  }else {
    send404Response(response);
  }
}




http.createServer(onRequest).listen(8888);
console.log("Server is running.....");


//demo.js
// Load the Cloudant library.




function readData(){
db = cloudant.db.use(dbname);
db.find({selector:{deviceId:'IoT2040'}}, function(er, result) {
  if (er) {
    throw er;
  }
  //document.write("Found documents with name IoT2040"+ result.docs.length);
  console.log('Found %s documents with name IoT2040', result.docs.length);
  var flag =true;
  if (flag) {
    for(var i = 0;i<result.docs.length;i++){
      //累加输入到文件中
      console.log('  Doc humidity: %s', result.docs[i].payload.temp);
      temp_local = result.docs[i].payload.temp;
    }
    flag = false;
  }
  if (result.docs.length>docs_length) {
  docs_length = result.docs.length;
  console.log("docs_length: %s",docs_length);
  temp_local = result.docs[result.docs.length-1].payload.temp;
  console.log('  Doc temp: %s', result.docs[result.docs.length-1].payload.temp);
      // console.log('  Doc humidity: %s', result.docs[i].payload.humidity);
      // console.log('  Doc longitude: %s', result.docs[i].payload.longitude);
      // console.log('  Doc latitude: %s', result.docs[i].payload.latitude);
  }else {
    console.log("docs_length not longer than now");
  }
});

}

setInterval(readData,5000);
