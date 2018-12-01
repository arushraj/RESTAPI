const express = require('express');
const bodyParser = require('body-parser');
// Configuring the database
const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');

// create express app
const app = express();

//get data as per deployment evnt
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || 'localhost',
    mongoURL = dbConfig.url || process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

mongoose.Promise = global.Promise;

// // Connecting to the database
// mongoose.connect(dbConfig.url)
//     .then(() => {
//         console.log("Successfully connected to the database");
//     }).catch(err => {
//         console.log('Could not connect to the database. Exiting now...');
//         process.exit();
//     });


var userAuth = {
    useNewUrlParser: true,
    auth: {
        user: 'adminUser',
        password: 'admin@mlabdb7'
    }
}

// Connecting to the database
mongoose.connect(mongoURL, userAuth)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...');
        process.exit();
    });


// define CROS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});

// Require Notes routes
require('./app/routes/note.routes')(app);

// listen for requests
app.listen(port, ip, () => {
    //console.log("Server is listening on port 8080");
    console.log('Server running on http://%s:%s', ip, port);
});




// Need some this code for setup, Imp code

// //  OpenShift sample Node application
// var express = require('express'),
//     app     = express(),
//     morgan  = require('morgan');
    
// Object.assign=require('object-assign')

// app.engine('html', require('ejs').renderFile);
// app.use(morgan('combined'))

// var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
//     ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
//     mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
//     mongoURLLabel = "";

// if (mongoURL == null) {
//   var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
//   // If using plane old env vars via service discovery
//   if (process.env.DATABASE_SERVICE_NAME) {
//     var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
//     mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
//     mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
//     mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
//     mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
//     mongoUser = process.env[mongoServiceName + '_USER'];

//   // If using env vars from secret from service binding  
//   } else if (process.env.database_name) {
//     mongoDatabase = process.env.database_name;
//     mongoPassword = process.env.password;
//     mongoUser = process.env.username;
//     var mongoUriParts = process.env.uri && process.env.uri.split("//");
//     if (mongoUriParts.length == 2) {
//       mongoUriParts = mongoUriParts[1].split(":");
//       if (mongoUriParts && mongoUriParts.length == 2) {
//         mongoHost = mongoUriParts[0];
//         mongoPort = mongoUriParts[1];
//       }
//     }
//   }

//   if (mongoHost && mongoPort && mongoDatabase) {
//     mongoURLLabel = mongoURL = 'mongodb://';
//     if (mongoUser && mongoPassword) {
//       mongoURL += mongoUser + ':' + mongoPassword + '@';
//     }
//     // Provide UI label that excludes user id and pw
//     mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//     mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
//   }
// }
// var db = null,
//     dbDetails = new Object();

// var initDb = function(callback) {
//   if (mongoURL == null) return;

//   var mongodb = require('mongodb');
//   if (mongodb == null) return;

//   mongodb.connect(mongoURL, function(err, conn) {
//     if (err) {
//       callback(err);
//       return;
//     }

//     db = conn;
//     dbDetails.databaseName = db.databaseName;
//     dbDetails.url = mongoURLLabel;
//     dbDetails.type = 'MongoDB';

//     console.log('Connected to MongoDB at: %s', mongoURL);
//   });
// };

// app.get('/', function (req, res) {
//   // try to initialize the db on every request if it's not already
//   // initialized.
//   if (!db) {
//     initDb(function(err){});
//   }
//   if (db) {
//     var col = db.collection('counts');
//     // Create a document with request IP and current time of request
//     col.insert({ip: req.ip, date: Date.now()});
//     col.count(function(err, count){
//       if (err) {
//         console.log('Error running count. Message:\n'+err);
//       }
//       res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
//     });
//   } else {
//     res.render('index.html', { pageCountMessage : null});
//   }
// });

// app.get('/pagecount', function (req, res) {
//   // try to initialize the db on every request if it's not already
//   // initialized.
//   if (!db) {
//     initDb(function(err){});
//   }
//   if (db) {
//     db.collection('counts').count(function(err, count ){
//       res.send('{ pageCount: ' + count + '}');
//     });
//   } else {
//     res.send('{ pageCount: -1 }');
//   }
// });

// // error handling
// app.use(function(err, req, res, next){
//   console.error(err.stack);
//   res.status(500).send('Something bad happened!');
// });

// initDb(function(err){
//   console.log('Error connecting to Mongo. Message:\n'+err);
// });

// app.listen(port, ip);
// console.log('Server running on http://%s:%s', ip, port);

// module.exports = app ;