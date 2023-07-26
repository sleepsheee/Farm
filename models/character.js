const mongoose = require("mongoose");
const path = require("path");
//schema=table

const coverImageBasePath = "uploads/characterCovers";
///Users/sekitakashi/Documents/sde_porject/Farm/public/uploads/characterCovers/3256b740f4c84c9692d2db15da72aea7
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

characterSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("character", characterSchema);
module.exports.coverImageBasePath = coverImageBasePath;
