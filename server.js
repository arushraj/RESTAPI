const express = require('express');
const bodyParser = require('body-parser');
// Configuring the database
const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');

// create express app
const app = express();

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
mongoose.connect(dbConfig.url, userAuth)
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
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});