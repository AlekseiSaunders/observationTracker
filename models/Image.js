const mongoose = require('mongoose');



const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

module.exports = mongoose.model('Image', ImageSchema)