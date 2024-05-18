const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utilities/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderstay");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("hi! i am root");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// this will handlw error when someone send request to undefined route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status, message } = err;
  res.render("error.ejs", { message });
  //   res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
