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
	gulp.src('./assets/views/**/*.jade')
	.pipe(jade({
		pretty:false,
		locals: {
			environment: env
		}
	}))
	.pipe(gulp.dest('./' + buildFolder + '/assets/views'))

	gulp.src('./assets/views/index.jade')
	.pipe(jade({
		pretty:false,
		locals: {
			environment: env
		}
	}))
	.pipe(gulp.dest('./' + buildFolder + '/assets'))

};

module.exports.watch.views = function() {
	gulp.watch('./assets/views/**/*.jade', ['client~views']);
}

module.exports.build.js = function() {
	var scripts = [
		'./assets/js/clean-blog.js'
	];
	
	console.log(nconf.get('NODE_ENV'));
	var stripping = false;
	if(env === "production" || "env" === "staging")
		stripping = true;
	
	var pumpArray = [
		gulp.src(scripts),
		concat('app.js'),
		uglify(),
		stripDebug(),
		gulp.dest('./' + buildFolder + '/assets/js')
	];
	if(env !== "production"){
		pumpArray.splice(2,2);
	}
	pump(pumpArray);
}

module.exports.watch.js = function() {
	gulp.watch('./assets/js/**/*.js', ['client~js']);
}

module.exports.build.lib = function(){
	//takes the un-minified copies of jquery & bootstrap and compresses them into "lib.js" and sends it to the build folder
	var libScripts = [
	   './lib/jquery/dist/jquery.js',
 	   './lib/bootstrap/dist/js/bootstrap.js'
	];

	pump([
		gulp.src(libScripts),
		concat('lib.js'),
		uglify(),
		gulp.dest('./' + buildFolder + '/assets/js')
	]);
}

module.exports.build.css = function(){
	var stylesheets = [
 	   './lib/bootstrap/dist/css/bootstrap.css',
 	   './lib/font-awesome/css/font-awesome.css'
	];

	pump([
		gulp.src(stylesheets),
		concat('lib.css'),
		uglifycss(),
		gulp.dest('./' + buildFolder + '/assets/css')
	]);
}

module.exports.build.extras = function() {
	var stylesheets = [
		'./assets/scss/*.scss'
	]
	pump([
		gulp.src(stylesheets),
		sass(),
		concat('app.css'),
		uglifycss(),
		gulp.dest('./' + buildFolder + '/assets/css')
	]);
	
	gulp.src('./assets/img/**/*')
	.pipe(gulp.dest('./' + buildFolder + '/assets/img'));

	gulp.src('./lib/font-awesome/fonts/**/*')
	.pipe(gulp.dest('./' + buildFolder + '/assets/fonts'));

	gulp.src('./assets/fonts/**/*')
	.pipe(gulp.dest('./' + buildFolder + '/assets/fonts'));
}

module.exports.watch.extras = function(){
	gulp.watch('./assets/scss/*.scss', ['client~extras']);
}