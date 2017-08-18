require('../config.js')
var express = require('express')
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
 
app.get('/', function (req, res) {
	

	res.send(req.body);
})
app.post("/",function(req,res){
res.send(req.body);
})
app.post('/token', function (req, res) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 100; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  res.send({token:text});
})
 
app.listen(process.env.APP_PORT,function(){
	console.log("App....",process.env.APP_PORT)
})