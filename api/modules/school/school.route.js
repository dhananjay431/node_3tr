var express = require('express')
var Client = require('node-rest-client').Client;
var client = new Client();
var app = express()
app.get('/', function (req, res) {
	req.send("sdfdsf");
//var args = {data: req.query,headers: { "Content-Type": "application/json" }};
 //  	client.get("http://localhost:3002/",args, function (response) {
 //    	console.log(response);
 //    	res.send(response);
	// });
})
// app.get('/token', function (req, res) {	
// 	if(req.token==true){
// 	var args = {data: req.query};
//   	client.get("http://localhost:3002/token",args, function (response) {
//     	res.send(response);
// 	});		
// 	}else{
// 		res.send("session expire");
// 	}

// })