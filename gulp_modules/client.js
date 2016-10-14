var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var stripDebug = require('gulp-strip-debug');
var pump = require('pump');

var nconf = require('nconf');
nconf.argv().env();
var env = nconf.get('NODE_ENV');
var buildFolder = 'build';
if(env === "staging")
	buildFolder += '/staging';
else if(env === "production")
	buildFolder += '/prod';
else
	buildFolder += '/local';

module.exports.build = {}, module.exports.watch = {};

module.exports.build.views = function() {
	gulp.src('./assets/client/views/**/*.jade')
	.pipe(jade({
		pretty:false,
		locals: {
			environment: env
		}
	}))
	.pipe(gulp.dest('./' + buildFolder + '/assets/client/views'))

	gulp.src('./assets/client/views/index.jade')
	.pipe(jade({
		pretty:false,
		locals: {
			environment: env
		}
	}))
	.pipe(gulp.dest('./' + buildFolder + '/assets/client'))

};

module.exports.watch.views = function() {
	gulp.watch('./assets/client/views/**/*.jade', ['client~views']);
}

module.exports.build.js = function() {
	var scripts = [
		'./assets/client/js/app.module.js',
		'./assets/client/js/**/*.module.js',
		'./assets/client/js/**/*.factory.js',
		'./assets/client/js/**/*.service.js',
		'./assets/client/js/**/*.directives.js',
		'./assets/client/js/**/*.filters.js',
		'./assets/client/js/**/*.controller.js',

		'./assets/client/js/wooted.js',
	];
	
	console.log(nconf.get('NODE_ENV'));
	var stripping = false;
	var envConfig = './assets/client/js/factories/config.factory.local.js';
	if(env === "production"){
		envConfig = './assets/client/js/factories/config.factory.prod.js';
		stripping = true;
	} 
	else if(env === "staging") {
		envConfig = './assets/client/js/factories/config.factory.staging.js';
		stripping = true;
	}
	scripts.splice(2, 0, envConfig);

	var pumpArray = [
		gulp.src(scripts),
		concat('app.js'),
		// uglify(),
		// stripDebug(),
		gulp.dest('./' + buildFolder + '/assets/client/js')
	];
	// if(env !== "production"){
	// 	pumpArray.splice(2,2);
	// }
	pump(pumpArray);
}

module.exports.watch.js = function() {
	gulp.watch('./assets/client/js/**/*.js', ['client~js']);
}

module.exports.build.lib = function(){
	var libScripts = [
		'./lib/angular/angular.js',
		'./lib/angular-ui-router/release/angular-ui-router.min.js',
		'./lib/angular-animate/angular-animate.js',
		'./lib/angular-aria/angular-aria.js',
		'./lib/angular-material/angular-material.js',
		'./lib/angular-seo/angular-seo.js',
		'./lib/angular-truncate/src/truncate.js',
		'./lib/angular-material-data-table/dist/md-data-table.js',
		'./lib/angular-material-icons/angular-material-icons.js'
	];

	pump([
		gulp.src(libScripts),
		concat('lib.js'),
		uglify(),
		gulp.dest('./' + buildFolder + '/assets/client/js')
	]);
}

module.exports.build.css = function(){
	var stylesheets = [
	'./lib/angular/angular-csp.css',
	'./lib/angular-material/angular-material.css',
	'./lib/angular-material-data-table/dist/md-data-table-style.css',
	'./lib/angular-material-icons/angular-material-icons.css'
	];

	pump([
		gulp.src(stylesheets),
		concat('lib.css'),
		uglifycss(),
		gulp.dest('./' + buildFolder + '/assets/client/css')
	]);
}

module.exports.build.extras = function() {
	var stylesheets = [
		'./assets/client/scss/*.scss'
	]
	pump([
		gulp.src(stylesheets),
		sass(),
		concat('app.css'),
		uglifycss(),
		gulp.dest('./' + buildFolder + '/assets/client/css')
	]);
	
	gulp.src('./assets/client/img/**/*')
	.pipe(gulp.dest('./' + buildFolder + '/assets/client/img'));

	gulp.src('./assets/client/fonts/**/*')
	.pipe(gulp.dest('./' + buildFolder + '/assets/client/fonts'));

	gulp.src('./lib/angular/angular.min.js.map')
	.pipe(gulp.dest('./' + buildFolder + '/assets/client/js'));

	gulp.src('./lib/angular-messages/angular-messages.min.js.map')
	.pipe(gulp.dest('./' + buildFolder + '/assets/client/js'));

	gulp.src('./lib/angular-local-storage/dist/angular-local-storage.min.js.map')
	.pipe(gulp.dest('./' + buildFolder + '/assets/client/js'));

}

module.exports.watch.extras = function(){
	gulp.watch('./assets/client/scss/*.scss', ['client~extras']);
}