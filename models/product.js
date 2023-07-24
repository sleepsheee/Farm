const mongoose = require("mongoose");
//schema=table
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchema);
