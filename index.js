var express = require('express');
var _ = require('underscore');
var nconf = require('nconf');
var http = require('http');
var q = require('q');

var router = express.Router();
var oneDay = 86400000; //used for setting cache of /assets

//determines what the node_environment is so it knows where to find the built site assets
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

//create the express app
var app = express();

app.use('/api', function(req, res, next) {
	res.status(501).send();
	//there's no API for this simple site, so return unimplemented if someone attempts to reach the API
});

//set up the routing to build files
app.use('/assets', express.static(__dirname + buildFolder + '/assets', {maxAge: oneDay}));

router.use('/assets/*', function(req, res){
	res.status(404).send();
});

//if they just arrive at bear-fight-betting.com, give them index.html
router.use('/', function(req, res){
	res.sendFile(__dirname + buildFolder + '/assets/views/app/index.html');
});

router.use('/newsletter', function(req, res){
	console.log('hit newsletter??');
	res.sendFile(__dirname + buildFolder + '/assets/views/app/newsletter.html');
});

router.use('/*', function(req, res){
	res.status(404).send();
});

app.use('/', router);

//create the express server
var port = 3000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
console.log('server listening on port ' + port + '.');