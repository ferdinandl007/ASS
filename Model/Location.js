/**
 * Created by Ali on 01/04/2017.
 */

var mongoose = require("mongoose");

var locationSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number

});

module.exports = mongoose.model('Location',locationSchema);
