/**
 * App initializer
 * @type {exports}
 */
var express = require('express');
var app = module.exports.app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var config = require('./config');

/**
 * App settings
 */
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * LISTEN SERVER
 */
server.listen(config.values.server_port, function() {
    console.log("Listening on " + config.values.server_port);
});