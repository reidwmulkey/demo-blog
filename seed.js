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
var env = nconf.get('NODE_ENV');
var buildFolder = '/build';
if(env === "staging")
	buildFolder += '/staging';
else if(env === "production")
	buildFolder += '/prod';
else
	buildFolder += '/local';


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
	try{
		woot.getTodaysWoots()
		.then(woot.storeWoots)
		.then(function(){
			console.log(new Date(), " - all woot items recorded successfully.");
		})
		.catch(console.error);
	}catch(e){console.error(e);}
	//setup a cron to catch the weekly deals (called events)
	/*woot.getWeeksEvents()
	.then(function(data){
		woot.storeWoots(_.flatten(data));
	})
	.then(function(){
		console.log(new Date(), " - all event items recorded successfully.");
	})
	.catch(console.error);*/
})
.catch(console.error);
