var cron = require('node-schedule');
var mongoose = require('mongoose');
var express = require('express');
var http = require('http');
var q = require('q');

var config = require('./modules/config');
var woot = require('./modules/woot');

var ready = q.defer();

mongoose.connect('mongodb://127.0.0.1:27017/test', function(err) {
	if (err) {
		console.error('Failed to connect to mongo on startup -', err);
		ready.reject(err);
	}
	else {
		console.log('mongo connection created.');
		ready.resolve();
	}
});

q.all([ready])
.then(function(){
	//setup a cron to catch the daily deals
	cron.scheduleJob('0 8 * * *', function(){
		woot.getTodaysWoots()
		.then(woot.storeWoots)
		.then(function(){
			console.log(new Date(), " - all woot items recorded successfully.");
		})
		.catch(console.error);
	});

	//setup a cron to catch the weekly deals (called events)
	cron.scheduleJob('0 8 * * 2', function(){
		console.log('weekly job unimplemented.');
	});

	//create the express app
	var app = express();

	app.use('/api', function(req, res, next) {
		if (1 !== mongoose.connection.readyState) {
			res.status(503).send();
		}
		else
			next();
	});

	//set up the routing to api/client
	var api = require('./api');
	var client = require('./client');

	app.use('/api', api);
	app.use('/', client);

	//error handling
	app.use(function (err, req, res, next) {
		res.status(500).send(err);
	});

	//create server
	var port = config.port;
	app.set('port', port);
	var server = http.createServer(app);
	server.listen(port);
	console.log('server listening on port ' + port + '.');
})
.catch(console.error);
