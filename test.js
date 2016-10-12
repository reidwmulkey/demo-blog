var woot = require('./modules/woot');
woot.getWeeksEvents()
.then(function(items){
	console.log(items[15]);
	// console.log(items);
})
.catch(console.error);
