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

schema.statics.getAll = function(limit){
	if(limit){
		return this.find().limit(limit).execQ();

	}
	else
		return this.findQ();
}

var model = mongoose.model('Woot', schema);

module.exports = model;