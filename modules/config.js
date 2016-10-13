module.exports = {
	port: 9001,
	mongoURL: 'mongodb://127.0.0.1:27017/wooted/test',
	wootSites: [
		{ name:'woot', url:'http://www.woot.com' }, 
		{ name:'electronics', url:'http://electronics.woot.com' },
		{ name:'home', url:'http://home.woot.com' }, 
		{ name:'tools & garden', url:'http://tools.woot.com' }, 
		{ name:'sport', url:'http://sport.woot.com' }, 
		{ name:'accessories & watches', url:'http://accessories.woot.com' }, 
		{ name:'wine', url:'http://wine.woot.com' }
		// { name:'shirt', url:'http://shirt.woot.com' }
	]
};