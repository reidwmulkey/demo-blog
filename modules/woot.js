var cheerio = require('cheerio');
var _ = require('underscore');
var http = require('http');
var q = require('q');

var config = require('./config');

var itemModel = require('../api/models/item'); //an individual item sold on woot.com
var instanceModel = require('../api/models/instance'); //an instance of selling the item on woot.com

module.exports.storeWoots = function(woots){
	//each woot object has both the item information and instance information.
	var deferred = q.defer();
	var promises = [];

	_.each(woots, function(woot){
		//make sure the item object is there
		var innerDeferred = q.defer();

		itemModel.getByNameOrCreate(woot.name, woot.photo)
		.then(function(item){
			return instanceModel.create({
				item: item._id,
				site: woot.site.name,
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

module.exports.getWeeksEvents = function(){
	var deferred = q.defer();
	var promises = [];

	_.each(config.wootSites, function(site){
		promises.push(module.exports.loadEvents(site));
	})

	q.all(promises)
	.then(function(data){
		var events = [];
		_.each(data, function(site){
			_.each(site, function(item){
				events.push(item);
			});
		});
		deferred.resolve(events);
	})
	.catch(deferred.reject);

	return deferred.promise;	
}

module.exports.loadEvents = function(site){
	var deferred = q.defer();
	var items = [];
	get(site.url)
	.then(function(body){
		var $ = cheerio.load(body);

		var events = [], promises = [];
		var list = $('#wootplus ul.event-tiles li');
		list.each(function(index, event){
			var $event = $(event);
			var eventPage = $event.find('a').attr('href');
			promises.push(getSubItems(eventPage, site));
		});
		q.all(promises)
		.then(deferred.resolve)
		.catch(deferred.reject);
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
				getSubItems(link, site)
				.then(deferred.resolve)
				.catch(deferred.reject);				
			}
			else
				deferred.resolve();
		}
		else{
			var itemName = $('h2.main-title').text();
			var itemPrice = $('.price-holder .price').text();
			var photo = $('.photo-section img').attr('src');

			var wootObj = {
				site: site,
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

function getSoldOutItemPrice(wootObj){
	var deferred = q.defer();

	get(wootObj.link)
	.then(function(linkBody){
		var $link = cheerio.load(linkBody);
		wootObj.price = $link('.price-exact .price').text();
		delete wootObj.link;
		deferred.resolve(wootObj);
	})
	.catch(deferred.reject);

	return deferred.promise;
}

function getSubItems(url, site){
	var deferred = q.defer();

	get(url)
	.then(function(linkBody){
		var $link = cheerio.load(linkBody);

		var items = [], soldOutItems = [];
		var list = $link('.offer-list li');
		list.each(function(index, item){
			var $item = $link(item);
			var wootObj = {
				site: site,
				name: $item.find('.info').find('h2').text(),
				price: $item.find('.info').find('.price').text(),
				photo: $item.find('a img').attr('src')
			};
			var priceMin = $item.find('.info').find('.price.min').text();
			if(priceMin)
				wootObj.price = priceMin + '-' + $item.find('.info').find('.price.max').text();
			if(!wootObj.price){
				wootObj.link = site.url + $item.find('a').attr('href');
				soldOutItems.push(getSoldOutItemPrice(wootObj));
			}
			else	
				items.push(wootObj);
		});
		q.all(soldOutItems)
		.then(function(moreItems){
			// console.log(moreItems);
			if(moreItems && moreItems.length > 0){
				// console.log(moreItems.length + "%%%" + moreItems);
				for(var i = 0; i < moreItems.length; i++)
					items.push(moreItems[i]);
			}
			deferred.resolve(items);
		})
		.catch(deferred.reject);
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