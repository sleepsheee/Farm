const mongoose = require("mongoose");
//schema=table
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // publishedAt: {
  //   type: Date,
  //   required: true,
  // },
  // coverImageName: {
  //   type: String,
  //   required: true,
  // },
  // comment: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model("product", productSchema);
