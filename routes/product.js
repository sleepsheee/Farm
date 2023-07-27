const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// all product routes
router.get("/", async (req, res) => {
  let query = Product.find();
  if (req.query.name != null && req.query.name !== "") {
    query = query.regex("name", new RegExp(req.query.name, "i")); //case insensitive i
  } //get query string
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishedAt", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishedAt", req.query.publishedAfter);
  }

  try {
    const products = await query.exec();

    //  const products = await Product.find(searchOptions);
    res.render("product/index", {
      products: products,
      searchOptions: req.query,
    });
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
    publishedAt: new Date(req.body.publishDate),
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
