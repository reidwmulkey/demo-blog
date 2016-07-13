var q = require('q');
var mongoose = require('mongoose');
var mongooseQ = require('mongoose-q')(mongoose);
var idValidator = require('mongoose-id-validator');
var errors = require('../../modules/errors');
var Schema = mongoose.Schema;

module.exports = function(){
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

	schema.statics.getAll = function(){
		return this.findQ();
	}

	// schema.statics.create = function(data){
	// 	var now = new Date();
	// 	if(data) data.timeWooted = now;
	// 	var woot = new this(data);
	// 	return woot.saveQ();
	// }

	var model = mongoose.model('Woot', schema);

	return model;
}