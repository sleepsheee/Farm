const express = require("express");
const Product = require("../models/product");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("public", Product.coverImageBasePath);
//console.log(Product.coverImagePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

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

router.get("/new", (req, res) => {
  res.render("product/new", { product: new Product() });
});

// router.get("/new", async (req, res) => {
//   renderNewPage(res, new Product());
// });

//create product
// router.post("/", async (req, res) => {
//   const product = new Product({
//     name: req.body.name,
//     publishedAt: new Date(req.body.publishDate),
//   });

//   try {
//     const newProduct = await product.save();

//     //res.redirect(`product/${newProduct.id}`)
//     res.redirect(`product`);
//   } catch {
//     res.render("product/new", {
//       product: product,
//       errorMessage: "error creating product",
//     });
//   }
// });

router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  console.log(req.file);
  const product = new Product({
    name: req.body.name,
    publishedAt: new Date(req.body.publishDate),
    coverImageName: fileName,
    description: req.body.description,
  });

  try {
    const newProduct = await product.save();
    //res.redirect(`product/${newProduct.id}`)

    res.redirect(`product`);
  } catch {
    if (product.coverImageName != null) {
      removeProductCover(product.coverImageName);
    }
    res.render("product/new", {
      product: product,
      errorMessage: "error creating product",
    });
  }
});

function removeProductCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}
// async function renderNewPage(res, product, hasError = false) {
//   try {
//     const products = await Product.find({});
//     const params = {
//       products: products,
//       character: character,
//     };
//     if (hasError) params.errorMessage = "error creating character";
//     res.render("character/new", params);
//   } catch {
//     res.redirect("/character");
//   }
// }

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
