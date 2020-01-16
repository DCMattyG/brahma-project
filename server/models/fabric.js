// app/models/fabric.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FabricSchema = new Schema({
  token: String,
  nodes: [{
    _id: false,
    name: String,
    rn: String,
    id: String,
    serial: String,
    role: String,
    model: String,
    connections: [{
      _id: false,
      sourcePort: String,
      destPort: String,
      destSwitch: String
    }]
  }]
});

module.exports = mongoose.model('Fabric', FabricSchema);
