const express = require("express");
const Character = require("../models/character");
const Product = require("../models/product");
const multer = require("multer");
const path = require("path");
const uploadPath = path.join("public", Character.coverImageBasePath);
const router = express.Router();
const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});
// all charater routes
router.get("/", async (req, res) => {
  res.send("all characters");
});

//new character routes
router.get("/new", async (req, res) => {
  renderNewPage(res, new Character());
});

//create character
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const character = new Character({
    name: req.body.name,
    origin: req.body.origin,
    coverImageName: fileName,
    description: req.body.description,
  });

  try {
    const newCharacter = await character.save();
    res.redirect(`character`);
  } catch {
    renderNewPage(res, character, true);
  }
});

async function renderNewPage(res, character, hasError = false) {
  try {
    const products = await Product.find({});
    const params = {
      products: products,
      character: character,
    };
    if (hasError) params.errorMessage = "error creating character";
    res.render("character/new", params);
  } catch {
    res.redirect("/character");
  }
}
module.exports = router;
