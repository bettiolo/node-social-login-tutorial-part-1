'use strict';
var express = require('express');
var request = require('request');
var router = express.Router();

router.post('/google/token-check', function (req, res) {
	// user_id, email
	var tokenInfoUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + req.body.access_token;
	request(tokenInfoUrl, function (err, apiRes, apiBody) {
		var tokenInfoResponse = JSON.parse(apiBody);
		if (err) {
			res.status(500);
		} else {
			if (tokenInfoResponse.audience !== process.env.GOOGLE_CLIENT_ID) {
				res.status(401);
			} else {
				res.status(200);
			}
		}
		res.json(tokenInfoResponse);
	});

});

module.exports = router;
