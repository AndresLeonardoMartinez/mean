
var express = require("express");
var bodyParser = require("body-parser");
const path = require('path');
var mongodb = require("mongodb");
var mongoose = require('mongoose');
var expressSession = require('express-session');
var ObjectID = mongodb.ObjectID;
var USER_COLLECTION = "users";
var bcrypt = require('bcrypt');
const saltRounds = 10;

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

var app = express();



app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
mongoose.connect(config.database); // connect to database


  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}




app.get('/setup', function(req, res) {

	// create a sample user
	var password = 'admin'
	bcrypt.hash(password, saltRounds, function(err, hash) {
  		// Store hash in your password DB.
		var admin = new User({ 
			name: 'administrador', 
			password: hash,
			admin: true 
		});
		admin.save(function(err) {
			if (err) throw err;

			console.log('User saved successfully');
			res.json({ success: true });
		});
	});
});
 

app.use('/api',require('./api'));
app.use('/',require('./lugares'));