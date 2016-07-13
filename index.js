var mongoose = require('mongoose');
var q = require('q');

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
	woot.getTodaysWoots()
	.then(console.log)
	.catch(console.error);	
});
