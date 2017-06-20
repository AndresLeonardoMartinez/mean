var express = require('express');
var apiRoutes = express.Router(); 
var app = express();
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
app.set('superSecret', config.secret); // secret variable
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;


module.exports = apiRoutes;
var CONTACTS_COLLECTION = "lugares";

// // Connect to the database before starting the application server. 
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lugares", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
  });

apiRoutes.get("/lugares/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({ _id: new ObjectID(req.params.id) }).limit(1).next(function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);  
    }
  });
});
apiRoutes.put("/lugares/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      res.status(204).end();
    }
  });
});


apiRoutes.get("/lugares", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get lugares.");
    } else {
      res.status(200).json(docs);  
    }
  });
});

apiRoutes.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);
    var metodo = req.method;
    var reqUrl=req.url;
    if (metodo ==="POST" || metodo==="DELETE" ){
        // check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
    }

    // // continue doing what we were doing and go to the route
    // next(); 
});



apiRoutes.post("/lugares", function(req, res) {
  var newLugar = req.body;

  newLugar.createDate = new Date();

  if (!(req.body.nombre)){
    handleError(res, "Invalid user input", "Must provide nombre.", 400);
  }
  else
  if(!(req.body.latitude)){
    handleError(res, "Invalid user input", "Must provide latitud.", 400);
  }
  else
  if (!(req.body.longitude)) 
  {
        handleError(res, "Invalid user input", "Must provide longitud", 400);
  }


  db.collection(CONTACTS_COLLECTION).insertOne(newLugar, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */




apiRoutes.delete("/lugares/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(204).end();
    }
  });
});