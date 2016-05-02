// simple express server
require('dotenv').config();
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var socket = require('./server/socket.js');

var ipaddress = '127.0.0.1';
var port = 3000;

var connectionString = 'mongodb://127.0.0.1:27017/drawing';
// connect to the database
var db = mongoose.connect(connectionString);

multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "My Secret",
    resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendfile((__dirname + '/index.html'));
});

require('./server/app.js')(app, db, mongoose);

var server = app.listen(port, ipaddress, function(){
    console.log('listening on: ' + ipaddress + ':' + port);
});

var io = require('socket.io').listen(server);

// Socket.io Communication
io.sockets.on('connection', socket);