var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
      title: 'Express',
      googleClientId: process.env.GOOGLE_CLIENT_ID
  });
});

module.exports = router;
