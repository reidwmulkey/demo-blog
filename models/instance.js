var q = require('q');
var mongoose = require('mongoose');
var mongooseQ = require('mongoose-q')(mongoose);
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
	site: {
		type: String,
		required: true
	},
	item: {
		type: Schema.ObjectId,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		unique: true,
		dropDupes: true
	}
});

schema.plugin(idValidator);

schema.statics.getById = function(wootId){
	return this.findOneQ({_id: wootId});
}

schema.statics.getByItemId = function(itemId){
	return this.findQ({item: itemId});
}

schema.statics.getAll = function(){
	return this.findQ();
}

schema.statics.create = function(data){
	var now = new Date();
	if(data) data.date = now;
	var instance = new this(data);
	return instance.saveQ();
}

var model = mongoose.model('Instance', schema);

module.exports = model;