const express = require("express");
const Character = require("../models/character");
const Product = require("../models/product");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("public", Character.coverImageBasePath);
const router = express.Router();
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// all charater routes
router.get("/", async (req, res) => {
  let query = Character.find();
  if (req.query.name != null && req.query.name != "") {
    query = query.regex("name", new RegExp(req.query.name, "i"));
  }
  // if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
  //   query = query.lte("publishDate", req.query.publishedBefore);
  // }
  // if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
  //   query = query.gte("publishDate", req.query.publishedAfter);
  // }
  try {
    const characters = await query.exec();
    res.render("character/index", {
      characters: characters,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
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
  //saveCover(character, req.body.cover);

  try {
    const newCharacter = await character.save();
    res.redirect(`character`);
  } catch {
    //remove book cover
    if (character.coverImageName != null) {
      removeCharacterCover(character.coverImageName);
    }

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

function removeCharacterCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

function saveCover(character, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
