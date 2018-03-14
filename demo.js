// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

var fs=require('fs');

 var me = '79f006ec-e65c-4ab0-9280-9d5701534e3f-bluemix'; // Set this to your own account
 var password = '96b9ad0a7aab85772a8d77cc987924d80daedcec8d986a269497aeecf2c311b7';
//
// // Initialize the library with my account.
 var cloudant = Cloudant({account:me, password:password});
//
// cloudant.db.list(function(err, allDbs) {
//   console.log('All my databases: %s', allDbs.join(', '))
// });

var dbname = 'iot2040_1';
var db = null;
var doc = null;
var docs_length = 0;


fs.unlink('temp.txt', (err) => {
if (err) throw err;
console.log('successfully deleted temp.txt');
});

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
      fs.appendFile('temp.txt',i+":"+result.docs[i].payload.temp+"\n",function(err){
             if(err) throw err;
         });
    }
    console.log('write into TEXT ');

    flag = false;
  }


  if (result.docs.length>docs_length) {
  docs_length = result.docs.length;
  console.log("docs_length: %s",docs_length);
  //document.write('Doc temp: '+result.docs[i].payload.temp);
  //console.log('  Doc temp: %s', result.docs[result.docs.length-1].payload.temp);
      // console.log('  Doc humidity: %s', result.docs[i].payload.humidity);
      // console.log('  Doc longitude: %s', result.docs[i].payload.longitude);
      // console.log('  Doc latitude: %s', result.docs[i].payload.latitude);
  }else {
    console.log("docs_length not longer than now");
  }
});

}

setInterval(readData,5000);
