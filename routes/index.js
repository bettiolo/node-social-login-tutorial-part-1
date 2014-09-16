var express = require('express');
var router = express.Router();

router.get('*', function (req, res) {
	res.render('index', {
		googleClientId: req.app.get('GOOGLE_CLIENT_ID')
	});
});

module.exports = router;
