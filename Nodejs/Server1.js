var http = require('http');
  var express = require('express')
  var app = express();
  app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.post('/test',function(req,res){
var select=req.body.Month
res.end(select);
console.log(select)
})


http.createServer(function(req,res){
//res.end(select);
}).listen(8080,'192.168.11.139')

console.log("Sever is Up in http://localhost");