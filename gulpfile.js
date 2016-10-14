var gulp = require('gulp');
var del = require('del');

var nconf = require('nconf');
nconf.argv().env();
var env = nconf.get('NODE_ENV');

var client = require('./gulp_modules/client');

//client
gulp.task('client~views',			client.build.views);
gulp.task('client~js', 				client.build.js);
gulp.task('client~lib', 			client.build.lib);
gulp.task('client~css', 			client.build.css);
gulp.task('client~extras', 			client.build.extras);

gulp.task('client~views:watch', 	client.watch.views);
gulp.task('client~js:watch', 		client.watch.js);
gulp.task('client~extras:watch',	client.watch.extras);

//runners
gulp.task('build:clean', function(){
	if(env === "production")
		return del([
			'./build-prod/**'
		]);
	else if(env === "staging")
		return del([
			'./build-dev/**'
		]);
	else
		return del([
			'./build/**'
		]);
});

gulp.task('server', function(){
	require('./');
});

gulp.task('build', [
	'client~views', 
	'client~js',
	'client~lib',
	'client~css',	
	'client~extras'
]);

gulp.task('watch', [
	'client~views:watch',
	'client~js:watch',
	'client~extras:watch',
	// removed for local NGINX server
	'server'
]);