var express = require('express');
var router = express.Router();

router.get('/:templateName', function (req, res) {
	res.render('templates/' + req.params.templateName);
});

module.exports = router;
