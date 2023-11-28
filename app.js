var express = require('express');
var server = express();
var routes = require('./routes');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var path = require('path');

server.use(cookieParser());
server.use(express.json());
server.use(express.static(path.join(__dirname + '/public')));
server.use(express.urlencoded({extended: true}));
server.set('view engine', 'pug');
server.set('views', path.join(__dirname + '/views'));
server.use(session({secret: 'ses', resave: false, saveUninitialized: false,}))

server.use('/',routes);
server.listen(3000);
module.exports = server;

