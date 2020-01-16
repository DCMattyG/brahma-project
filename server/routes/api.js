var express = require('express');
var router = express.Router();

var Fabric = require('../models/fabric');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'api works' });
});

router.route('/fabric')
// create a bear (accessed at POST http://localhost:8080/api/bears)
.post(function(req, res) {
    var fabric = new Fabric(req.body);      // create a new instance of the Bear model
    // bear.name = req.body.name;  // set the bears name (comes from the request)

    // save the bear and check for errors
    fabric.save(function(err) {
      if (err)
        res.send(err);

      res.setHeader('Content-Type', 'application/json');
      res.json({ token: fabric.token });
    });
});

router.route('/fabric/:fabric_token')
// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
.get(function(req, res) {
  Fabric.findOne({token: req.params.fabric_token}, function(err, fabric) {
    if (err || fabric == null)
      res.status(404).send(err);
    else
      res.setHeader('Content-Type', 'application/json');
      res.json(fabric);
  });
});

module.exports = router;
