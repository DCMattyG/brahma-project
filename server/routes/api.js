var express = require('express');
var router = express.Router();

var Fabric = require('../models/fabric');

/* GET fabric listing. */
router.get('/', function(req, res, next) {
  res.json({ message: 'api works' });
});

router.route('/fabric')
// create a fabric (accessed at POST http://localhost:8080/api/fabric)
.post(function(req, res) {
    var fabric = new Fabric(req.body);      // create a new instance of the Fabric model

    // save the fabric and check for errors
    fabric.save(function(err) {
      if (err)
        res.send(err);

      res.json({ token: fabric.token });
    });
});

router.route('/fabric/:fabric_token')
// get the fabric with the given token (accessed at GET http://localhost:8080/api/fabric/:fabric_token)
.get(function(req, res) {
  Fabric.findOne({token: req.params.fabric_token}, function(err, fabric) {
    if (err || fabric == null)
      res.status(404).send(err);
    else
      res.json(fabric);
  });
});

module.exports = router;
