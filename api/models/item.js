var q = require('q');
var mongoose = require('mongoose');
var mongooseQ = require('mongoose-q')(mongoose);
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		dropDups: true
	},
	image: String
});

schema.plugin(idValidator);

schema.statics.getByNameOrCreate = function(name, image){
	return this.findOneAndUpdateQ({name: name}, {
		name: name,
		image: image
	},{
		new: true,
		upsert: true
	});
}

schema.statics.getById = function(wootId){
	return this.findOneQ({_id: wootId});
}

schema.statics.search = function(itemName){
	// if(!itemName) return schema.statics.getAll(100);
	// else {
		var exp = new RegExp(itemName, 'i');
		var data = { name: { $regex: exp } };
		return this.find(data)
		.limit(100)
		.execQ();
	// }
}

schema.statics.getAll = function(limit){
	console.log('no search text, getting all');
	if(limit)
		return this.find().limit(limit).execQ();
	else
		return this.findQ();
}

var model = mongoose.model('Woot', schema);

module.exports = model;