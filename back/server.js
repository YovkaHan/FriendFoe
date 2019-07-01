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
//
// app.post('/participant/create', function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//
//     const {user} = req.body;
//     const {id} = user;
//     const result = {};
//
//     if (!id) {
//         user.id = moment().unix() + '_' + uniqid.process();
//     }
//
//     Participant.add(user).then(data => {
//         if (data.error) {
//             result.error = data.error;
//
//             res.json(result);
//         } else {
//             Tokens.addObject().then(authToken => {
//                 result.authToken = authToken;
//                 result.user = {...user, id: data.id};
//
//                 res.json(result);
//             });
//         }
//     });
// });
//
// app.post('/participant/edit', function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//
//     const {user} = req.body;
//     const result = {};
//
//     Participant.edit(user).then(data => {
//         if (data.error) {
//             result.error = data.error;
//         } else {
//             result.user = data;
//         }
//
//         res.json(result);
//     });
// });
//
// /**req = {user} res = {user || error}*/
// app.post('/participant/get', function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//
//     const {user} = req.body;
//     const result = {};
//
//     Participant.get(user).then(data => {
//         if (data.error) {
//             result.error = data.error;
//         } else {
//             result.user = data;
//         }
//
//         res.json(result);
//     });
// });
//
// /**req = {id} res = {token, id || error}*/
// app.post('/participant/login', function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//     /** -Взять с тела запроса идишник */
//     const {id} = req.body;
//     const result = {};
//
//     /** -Проверить идишник в базе данных (есть ли такой же)*/
//     Participant.getAll().then(participants => {
//         if (participants.find(p => p.id === id)) {
//             Tokens.addObject(0, id).then(token => {
//                 result.token = token;
//                 result.id = id;
//
//                 res.json(result);
//             });
//         } else {
//             result.error = 'В базе нет такого пользователя. Кышъ';
//
//             res.json(result);
//         }
//     });
// });
//
// /**req = {token, id} res = {status, token || error}*/
// app.post('/participant/logout', function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//     /** -Взять с тела запроса authToken, userId*/
//     const {token, id} = req.body;
//     const result = {};
//
//     console.log('logout');
//
//     /** -Проверить authToken и удалить если будет*/
//     Tokens.removeObject(token, id).then(() => {
//
//         result.status = 200;
//         result.token = token;
//
//         res.json(result);
//     });
// });


server.listen({
    port, host,
}, () => {
    console.log('server started')
});
