var express = require('express');
var router = express.Router();

router.get('/partials/*', function (req, res) {
	console.log('loading: ' + req.path.substring(1));
	res.render(req.path.substring(1));
});

router.get('/app/*', function (req, res) {
	console.log('loading: ' + req.path.substring(1));
	var path = req.path.substring(1);
	res.render(path, {}, function(err, page){
		console.log(err);
		if(err)
			res.send(err);
		else
			res.end(page);
	});
});

router.get('*', getIndex);

function getIndex(req, res, next){
	res.render('index');	
}

module.exports = router;