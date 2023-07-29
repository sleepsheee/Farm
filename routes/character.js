const express = require("express");
const Character = require("../models/character");
const Product = require("../models/product");
// const multer = require("multer");
//const path = require("path");
const fs = require("fs");
//const uploadPath = path.join("public", Character.coverImageBasePath);
//const uploadPa//th = Character.coverImageBasePath);
//console.log(Character.coverImageBasePath);
const router = express.Router();
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

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

//create character route
router.post("/", async (req, res) => {
  //const fileName = req.file != null ? req.file.filename : null;

  const character = new Character({
    name: req.body.name,
    origin: req.body.origin,
    //coverImageName: fileName,
    description: req.body.description,
  });

  saveCover(character, req.body.cover); //encoded json

  try {
    const newCharacter = await character.save();
    res.redirect(`character`);
  } catch {
    //remove book cover
    // if (character.coverImageName != null) {
    //   removeCharacterCover(character.coverImageName);
    // }

    renderNewPage(res, character, true);
  }
});

// function removeCharacterCover(fileName) {
//   fs.unlink(path.join(uploadPath, fileName), (err) => {
//     if (err) console.error(err);
//   });
// }

// Show character Route
router.get("/:id", async (req, res) => {
  try {
    const character = await Character.findById(req.params.id) //populate for get the object
      .populate("origin")
      .exec();
    res.render("character/show", { character: character });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// Edit character Route
router.get("/:id/edit", async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    renderEditPage(res, character);
  } catch {
    res.redirect("/");
  }
});

// Update character Route
router.put("/:id", async (req, res) => {
  let character;

  try {
    character = await Character.findById(req.params.id);
    character.name = req.body.name;
    character.origin = req.body.origin;
    character.description = req.body.description;
    if (req.body.cover != null && req.body.cover !== "") {
      //default cover is null
      saveCover(character, req.body.cover);
    }
    await character.save();
    res.redirect(`/character/${character.id}`);
  } catch {
    if (character != null) {
      renderEditPage(res, character, true);
    } else {
      redirect("/");
    }
  }
});

// Delete character Page
router.delete("/:id", async (req, res) => {
  let character;
  try {
    character = await Character.findById(req.params.id);
    await character.remove();
    res.redirect("/character");
  } catch {
    if (character != null) {
      res.render("character/show", {
        character: character,
        errorMessage: "Could not remove character",
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, character, hasError = false) {
  renderFormPage(res, character, "new", hasError);
}

async function renderEditPage(res, character, hasError = false) {
  renderFormPage(res, character, "edit", hasError);
}

async function renderFormPage(res, character, form, hasError = false) {
  try {
    const products = await Product.find({});
    const params = {
      products: products,
      character: character,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating character";
      } else {
        params.errorMessage = "Error Creating character";
      }
    }
    res.render(`character/${form}`, params);
  } catch {
    res.redirect("/character");
  }
}
function saveCover(character, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    character.coverImage = new Buffer.from(cover.data, "base64");
    character.coverImageType = cover.type;
  }
}

module.exports = router;
