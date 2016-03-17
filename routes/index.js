var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.send('heyyy');
});

module.exports = router;
