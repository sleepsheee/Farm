const mongoose = require("mongoose");
//schema=table

const coverImageBasePath = "uploads/characterCovers";

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
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
module.exports.coverImageBasePath = coverImageBasePath;
