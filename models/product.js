const mongoose = require("mongoose");
//schema=table
const path = require("path");

const coverImageBasePath = "uploads/productCovers";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImageName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

productSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("product", productSchema);
module.exports.coverImageBasePath = coverImageBasePath;
