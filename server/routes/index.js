var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(path.join(__dirname, '../'));
  console.log(path.join(__dirname, '../dist/brahma-web/index.html'));
  res.sendFile(path.join(__dirname, '../dist/brahma-web/index.html'));
});

router.get('*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
