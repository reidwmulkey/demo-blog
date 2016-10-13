var ObjectId = require('mongoose').Types.ObjectId;
var express = require('express');

var itemModel = require('./models/item');
var instanceModel = require('./models/instance');

var app = express();
var router = express.Router();

// var getAllItems = function(req, res, next){
// 	itemModel.getAll()
// 	.then(function(items){
// 		res.send(items);
// 	}).catch(next);
// }

var getItem = function(req, res, next){
	var itemId = req.query.itemId;
	if(!itemId){
		itemModel.getAll(100)
		.then(function(items){
			res.send(items);
		}).catch(next);
	}
	else {
		if(typeof itemId === "string") itemId = new ObjectId(itemId);
		itemModel.getById(itemId)
		.then(function(item){
			instanceModel.getByItemId(itemId)
			.then(function(instances){
				console.log(instances);
				var data = item.toObject();
				data.instances = instances;
				res.send(data);
			})
		}).catch(next);
	}
}

var searchItems = function(req, res, next){
	var itemName = req.query.itemName;
	var selectedSites = req.query.selectedSites;
	itemModel.search(itemName)
	.then(function(items){
		// console.log(items);
		res.send(items);
	}).catch(next);
}

// router.get('/items/all', getAllItems);
router.get('/items/detail', getItem);
router.get('/items/search', searchItems);

app.use('/', router);

module.exports = app;