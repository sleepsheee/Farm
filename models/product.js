const mongoose = require("mongoose");
const Character = require("./character");
//schema=table
// const path = require("path");

// const coverImageBasePath = "uploads/productCovers";

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
  coverImage: {
    //store img on server
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

// productSchema.virtual("coverImagePath").get(function () {
//   if (this.coverImageName != null) {
//     return path.join("/", coverImageBasePath, this.coverImageName);
//   }
// });

productSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

productSchema.pre("remove", function (next) {
  Character.find({ origin: this.id }, (err, character) => {
    console.log(character.length > 0);
    if (err) {
      next(err);
    } else if (character.length > 0) {
      next(new Error("This product has character still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("product", productSchema);
// module.exports.coverImageBasePath = coverImageBasePath;
