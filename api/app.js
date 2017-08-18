require('../config.js');
var express = require('express')

var Client = require('node-rest-client').Client;
var client = new Client();
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.get('/token',function(req,res){	
//	res.send("asdfsdaf");
		var args = {data: req.query,headers: { "Content-Type": "application/json" }};
  		client.post("http://localhost:3002/token",args, function (data,response) {
  			res.set({"dtkn":data.token});
  			res.jsonp(data);
  		});	
		client.on('error', function(err){res.send("err");});

});
app.use('/api',function(req,res){
	console.log(req.path)
	if(req.method=='GET'){
			console.log("h1",req.get('f1'));  
	var args = {
    data: req.query,
    headers: { "Content-Type": "application/json" }};
  		client.post("http://localhost:3002"+req.path,args, function (data,response) {
  			res.jsonp(data);
  		});	
		client.on('error', function(err){res.send("err");});
	}
	if(req.method=='POST'){
		console.log("h1",req.get('f1')); 
		console.log(req.body)
		console.log("post");
	var args = {data: req.body,headers: { "Content-Type": "application/json" }};
  		client.post("http://localhost:3002"+req.path,args, function (response) {
    	res.send(response);
	});	
	}	
});
app.listen(process.env.API_PORT,function(){
	console.log("api.......",process.env.API_PORT);
})