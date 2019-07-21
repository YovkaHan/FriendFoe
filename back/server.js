// Configs
const {mongoURI, host, port} = require('../config/default').server;

// Initiations
const express = require('express');
const app = require('express')();
const mongoose = require('mongoose');
const path = require('path');
const url = require('url');
const server = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const fractionsRoute = require('./api/fractions');
const relationsRoute = require('./api/relations');
const customRelationsRoute = require('./api/customRelations');
const unionsRoute = require('./api/unions');
const configsRoute = require('./api/configs');

// Debug tools
const winston = require('winston'); // for transports.Console
const expressWinston = require('express-winston');

// DB config
const db = mongoURI;

// Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(()=> {
        console.log('Mongo DB connected');
    })
    .catch(err => console.error(err));

app.use(cors({credentials: true, origin: true}));
app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(express.methodOverride());

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

// Now we can tell the app to use our routing code:
app.use('/api/fractions', fractionsRoute);
app.use('/api/relations', relationsRoute);
app.use('/api/customRelationsRoute', customRelationsRoute);
app.use('/api/unions', unionsRoute);
app.use('/api/configs', configsRoute);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

server.listen({
    port, host,
}, () => {
    console.log('server started')
});
