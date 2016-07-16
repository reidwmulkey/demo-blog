var cheerio = require('cheerio');
var _ = require('underscore');
var http = require('http');
var q = require('q');

var config = require('./config');

var itemModel = require('../models/item'); //an individual item sold on woot.com
var instanceModel = require('../models/instance'); //an instance of selling the item on woot.com

module.exports.storeWoots = function(woots){
	//each woot object has both the item information and instance information.
	var deferred = q.defer();
	var promises = [];

	_.each(woots, function(woot){
		//make sure the item object is there
		var innerDeferred = q.defer();
		
		itemModel.getByNameOrCreate(woot.name, woot.photo)
		.then(function(item){
			console.log(woot.price);
			return instanceModel.create({
				item: item._id,
				site: woot.site,
				price: woot.price
			});
		})
		.then(innerDeferred.resolve)
		.catch(innerDeferred.reject);
		
		promises.push(innerDeferred.promise);
	})

	q.all(promises)
	.then(deferred.resolve)
	.catch(deferred.reject);

	return deferred.promise;
}

module.exports.getTodaysWoots = function(){
	var deferred = q.defer();
	var promises = [];

	_.each(config.wootSites, function(site){
		promises.push(module.exports.loadWoot(site));
	})

	q.all(promises)
	.then(function(data){
		var woots = [];
		_.each(data, function(site){
			_.each(site, function(item){
				woots.push(item);
			});
		});
		deferred.resolve(woots);
	})
	.catch(deferred.reject);

	return deferred.promise;
}

module.exports.loadWoot = function(site){
	var deferred = q.defer();

	get(site.url)
	.then(function(body){
		var $ = cheerio.load(body);

		if($('.price-holder .price.min').text()){
			// itemPrice = $('.price-holder .price.min').text() + "-" + $('.price-holder .price.max').text();
			var link = $('.wantone').attr('href');
			if(link && link.indexOf('http://') !== -1){
				getSubItems(link, site.name)
				.then(deferred.resolve)
				.catch(deferred.reject);				
			}
		}
		else{
			var itemName = $('h2.main-title').text();
			var itemPrice = $('.price-holder .price').text();
			var photo = $('.photo-section img').attr('src');

			var wootObj = {
				site: site.name,
				name: itemName,
				price: itemPrice,
				photo: photo
			};
			deferred.resolve([wootObj]);
		}
	})
	.catch(deferred.reject);

	return deferred.promise;
}

function getSubItems(url, siteName){
	var deferred = q.defer();

	get(url)
	.then(function(linkBody){
		var $link = cheerio.load(linkBody);

		var items = [];
		var list = $link('.offer-list .info');
		list.each(function(index, item){
			var $item = $link(item);
			var wootObj = {
				site: siteName,
				name: $item.find('h2').text(),
				price: $item.find('.price').text(),
				photo: $item.parent().find('img').attr('src')
			};
			items.push(wootObj);
		});
		deferred.resolve(items);
	})
	.catch(deferred.reject);

	return deferred.promise;
}

function get(url){
	var deferred = q.defer();
	http.get(url, function(res){
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			deferred.resolve(body);
		});
	})
	.on('error', deferred.reject);
	return deferred.promise;
}