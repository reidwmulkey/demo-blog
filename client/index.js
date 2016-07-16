var express = require('express');
var app = express();
var helmet = require('helmet');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(helmet());
app.use(helmet.csp({
	directives: {
		defaultSrc: ["'self'",],
		scriptSrc: ["'self'"],
		styleSrc: ["'self'", "'unsafe-inline'"],
		fontSrc: ["https://maxcdn.bootstrapcdn.com", "'self'"],
		imgSrc: ["'self'", 'data:', 'https://images-na.ssl-images-amazon.com'],
		// connectSrc: ["'self'"]
	},

	// Set to true if you only want browsers to report errors, not block them 
	reportOnly: false,

	// Set to true if you want to blindly set all headers: Content-Security-Policy, 
	// X-WebKit-CSP, and X-Content-Security-Policy. 
	setAllHeaders: false,

	// Set to true if you want to disable CSP on Android where it can be buggy. 
	disableAndroid: false,

	// Set to false if you want to completely disable any user-agent sniffing. 
	// This may make the headers less compatible but it will be much faster. 
	// This defaults to `true`. 
	browserSniff: true
}));

var index = require('./endpoints/index');
app.use('/', index);

module.exports = app;