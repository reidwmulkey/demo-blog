module.exports = function(){
	var module = {};
	module.models = {};
	var Item = mongoose.model('Item'),
	Instance = mongoose.model('Instance'),
	module.models.Item = Item;
	module.models.Instance = Instance;
	
	module.getItem = function(itemId){
		Item.getItem
	}

	return module;
};