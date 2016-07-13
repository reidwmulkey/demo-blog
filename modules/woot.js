var cheerio = require('cheerio');
var _ = require('underscore');
var http = require('http');
var q = require('q');

var config = require('./config');

module.exports.getTodaysWoots = function(){
	var deferred = q.defer();
	var promises = [];

	_.each(config.wootSites, function(site){
		promises.push(module.exports.loadWoot(site));
	})

	q.all(promises)
	.then(deferred.resolve)
	.catch(deferred.reject);

	return deferred.promise;
}

module.exports.loadWoot = function(site){
	var deferred = q.defer();

	http.get(site.url, function(res){
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var $ = cheerio.load(body);

			var itemName = $('h2.main-title').text();
			var itemPrice;
			if($('.price-holder .price.min').text())
				itemPrice = $('.price-holder .price.min').text() + "-" + $('.price-holder .price.max').text();
			else 
				itemPrice = $('.price-holder .price').text();
			var photo = $('.photo-section img').attr('src');

			var wootObj = {
				site: site.name,
				name: itemName,
				price: itemPrice
			};
			if(photo) wootObj.photo = photo;
			deferred.resolve(wootObj);
		});
	})
	.on('error', deferred.reject);

	return deferred.promise;
}