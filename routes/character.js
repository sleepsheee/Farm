const express = require("express");
const Character = require("../models/character");
const Product = require("../models/product");

const router = express.Router();

// all charater routes
router.get("/", async (req, res) => {
  res.send("all characters");
});

//new character routes
router.get("/new", async (req, res) => {
  try {
    const products = await Product.find({});
    const character = new Character();
    res.render("character/new", {
      products: products,
      character: character,
    });
  } catch {
    res.redirect("/character");
  }
});

//create character
router.post("/", async (req, res) => {
  res.send("create characters");
});
//   product.save((err, newProduct) => {
//     if (err) {
//       res.render("product/new", {
//         product: product,
//         errorMessage: "error creating product",
//       });
//     } else {
//       //res.redirect(`product/${newProduct.id}`)
//       res.redirect(`product`);
//     }
//   });
// });

module.exports = router;
