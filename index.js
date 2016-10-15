var cron = require('node-schedule');
var mongoose = require('mongoose');
var express = require('express');
var _ = require('underscore');
var nconf = require('nconf');
var http = require('http');
var q = require('q');

var config = require('./modules/config');
var woot = require('./modules/woot');

var router = express.Router();
var ready = q.defer();
var oneDay = 86400000;
nconf.argv().env();
var env = nconf.get('NODE_ENV');
console.log('environment: ' + env);
var buildFolder = '/build';
if(env === "staging")
	buildFolder += '/staging';
else if(env === "production")
	buildFolder += '/prod';
else
	buildFolder += '/local';

console.log('build folder: ' + buildFolder);
mongoose.Promise = q.Promise;

mongoose.connect(config.mongoURL, function(err) {
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
		console.log('starting to retrieve the daily items.');
		woot.getTodaysWoots()
		.then(woot.storeWoots)
		.then(function(){
			console.log(new Date(), " - all woot items recorded successfully.");
		})
		.catch(console.error);
	});

	//setup a cron to catch the weekly deals (called events)
	cron.scheduleJob('0 8 * * 1', function(){
		console.log('starting to retrieve the weekly items.');
		woot.getWeeksEvents()
		.then(function(data){
			woot.storeWoots(_.flatten(data));
		})
		.then(function(){
			console.log(new Date(), " - all event items recorded successfully.");
		})
		.catch(console.error);
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

	app.use('/api', api);
	app.use('/assets', express.static(__dirname + buildFolder + '/assets', {maxAge: oneDay}));

	router.use('/assets/*', function(req, res){
		res.status(404).send();
	});

	router.use('/', function(req, res){
		res.sendFile(__dirname + buildFolder + '/assets/client/index.html');
	});

	router.use('/*', function(req, res){
		res.status(404).send();
	});

	app.use('/', router);

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
