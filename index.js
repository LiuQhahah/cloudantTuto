
var express = require('express');
var Cloudant = require('@cloudant/cloudant');
var index = require('./routes/index');
var sidebar = require('./routes/sidebar')

var me = 'e5ef7307-8877-4a1a-ad5d-ecc569cfba6d-bluemix'; // Set this to your own account
var password = '29a34765704aeefa6cd51d760734f6f3043594f4e85c9874927de11789c39f6e';
var cloudant = Cloudant({ account: me, password: password });
var app = express();
//设置ejs为view引擎
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use('/', index);
app.use('/sidebar', sidebar);
//404 response
function send404Response(response) {
  response.writeHead(404, { "Content-Type": "text/plgain" });
  response.write("Error 404: Page not found");
  response.end();
}


app.listen(3000);
console.log("Read data ....");
module.exports = app;