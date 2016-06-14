

// Creates an Express application. 
  var express = require('express') 
  var app=express();


// Optional Step 
  app.engine('html', require('ejs').renderFile); 
  app.set('view engine', 'html'); 


//listens for connections on the specified host and port
app.listen(443,'localhost') 


// respond with "hello world" when a GET request is made to the homepage
app.get('/',function(req,res){
	res.send('Hello World');
})

console.log("Sever is Up in LocalHost");


/** Read More About Express FrameWork http://expressjs.com  **/