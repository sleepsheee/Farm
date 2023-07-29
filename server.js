const express = require("express");
const dotenv = require("dotenv");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");
const productRouter = require("./routes/product");
const characterRouter = require("./routes/character");

const bodyParser = require("body-parser");
dotenv.config({ path: "./config.env" });

const methodOverride = require("method-override"); //brower only support get and post

app.set("view engine", "ejs"); //ejs as view engine
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"));
//databse
const mongoose = require("mongoose");
const db = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log("db connection successful ");
  });

app.use("/", indexRouter);
app.use("/product", productRouter);
app.use("/character", characterRouter);
app.listen(process.env.PORT || 3000);
