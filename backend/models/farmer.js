const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nicnumber: {
    type: String,
    required: true,
  },
  selectedDistrict: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  profileimage: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("farmer", postSchema);
