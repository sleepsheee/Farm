const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// all product routes
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i"); //case insensitive i
  } //get query string
  try {
    const product = await Product.find(searchOptions);
    res.render("product/index", { product: product, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

//new product routes
router.get("/new", (req, res) => {
  res.render("product/new", { product: new Product() });
});

//create product
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
  });
  try {
    const newProduct = await product.save();
    //res.redirect(`product/${newProduct.id}`)
    res.redirect(`product`);
  } catch {
    res.render("product/new", {
      product: product,
      errorMessage: "error creating product",
    });
  }
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
