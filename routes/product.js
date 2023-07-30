const express = require("express");
const Product = require("../models/product");
const Character = require("../models/character");
// const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
// const uploadPath = path.join("public", Product.coverImageBasePath);
//const uploadPath = Product.coverImageBasePath;

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     console.log(imageMimeTypes.includes(file.mimetype));
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// all product routes
router.get("/", async (req, res) => {
  let query = Product.find();
  if (req.query.name != null && req.query.name != "") {
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
    res.render("product/index", {
      products: products,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//new product
router.get("/new", async (req, res) => {
  // res.render("product/new", { product: new Product() });
  renderNewPage(res, new Product());
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

//create product
router.post("/", async (req, res) => {
  // const fileName = req.file != null ? req.file.filename : null;

  const product = new Product({
    name: req.body.name,
    publishedAt: new Date(req.body.publishDate),
    // coverImageName: fileName,
    description: req.body.description,
  });
  saveCover(product, req.body.cover);

  try {
    const newProduct = await product.save();

    res.redirect(`product/${newProduct.id}`);
  } catch {
    // if (product.coverImageName != null) {
    //   removeProductCover(product.coverImageName);
    // }
    renderNewPage(res, product, true);
    // res.render("product/new", {
    //   product: product,
    //   errorMessage: "error creating product",
    // });
  }
});
//new route should before get id,because if after, new will be see as id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const characters = await Character.find({ origin: product.id })
      .limit(6)
      .exec();
    res.render("product/show", {
      product: product,
      productBycharacter: characters,
    });
  } catch {
    // console.log(err);
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("product/edit", { product: product });
  } catch {
    res.redirect("/product");
  }
});

router.put("/:id", async (req, res) => {
  //res.send("update anime" + req.params.id);
  let product;
  try {
    product = await Product.findById(req.params.id);
    product.name = req.body.name;
    await product.save();
    res.redirect(`/product/${product.id}`); //add / from root
  } catch {
    if (product == null) {
      res.redirect("/");
    } else {
      res.render("product/edit", {
        product: product,
        errorMessage: "Error updating product",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
    res.redirect("/product");
  } catch {
    if (product == null) {
      res.redirect("/");
    } else {
      res.redirect(`/product/${product.id}`);
    }
  }
});

async function renderNewPage(res, product, hasError = false) {
  try {
    const products = await Product.find({});
    const params = {
      product: product,
    };
    if (hasError) params.errorMessage = "error creating character";
    res.render("product/new", params);
  } catch {
    res.redirect("/product");
  }
}

function saveCover(product, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImage = new Buffer.from(cover.data, "base64");
    product.coverImageType = cover.type;
  }
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

module.exports = router;
