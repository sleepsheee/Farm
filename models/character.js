const mongoose = require("mongoose");
//schema=table
const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
  },
  coverImageName: {
    type: String,
    required: true,
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    requied: true,
    ref: "product",
  },
});

module.exports = mongoose.model("character", characterSchema);
