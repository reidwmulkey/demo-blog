var ObjectId = require('mongoose').Types.ObjectId;
var express = require('express');

var itemModel = require('../models/item');
var instanceModel = require('../models/instance');

var app = express();
var router = express.Router();

// var getAllItems = function(req, res, next){
// 	itemModel.getAll()
// 	.then(function(items){
// 		res.send(items);
// 	}).catch(next);
// }

var getItems = function(req, res, next){
	var itemId = req.query.itemId;
	if(!itemId){
		itemModel.getAll()
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
				var data = item.toObject();
				data.instances = instances;
				res.send(data);
			})
		}).catch(next);
	}
}

// router.get('/items/all', getAllItems);
router.get('/items', getItems);

app.use('/', router);

module.exports = app;