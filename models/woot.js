var q = require('q');
var mongoose = require('mongoose');
var mongooseQ = require('mongoose-q')(mongoose);
var idValidator = require('mongoose-id-validator');
var errors = require('../../modules/errors');
var Schema = mongoose.Schema;

module.exports = function(){
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
		timeWooted: {
			type: Date,
			required: true
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
		if(data) data.timeWooted = now;
		var woot = new this(data);
		return woot.saveQ();
	}

	var model = mongoose.model('Woot', schema);

	return model;
}