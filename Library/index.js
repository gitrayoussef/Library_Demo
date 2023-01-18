const express = require("express");
const fs = require("node:fs");
const app = express();
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set("view engine", "ejs");
let settings = {
  counterId: 16,
};
let books;
// SHOW ALL BOOKS ROUTE
app.get("/showbooks", (req, res) => {
  let fbooks = books;
  if (req.query.q) {
    console.log(books.length);
    fbooks = fbooks.filter((item) => item.title.indexOf(req.query.q) > -1);
    console.log(books.length);
  }
  res.render(__dirname + "/views/showbooks.ejs", { books:fbooks });
});
// ADD NEW BOOK ROUTE
app.get("/addbook", (req, res) => {
  res.render(__dirname + "/views/addbook.ejs");
});
app.post("/addbook", urlencodedParser, (req, res) => {
  req.body._id = settings.counterId++;
  books.push(req.body);
  saveBooksData();
  res.redirect("/showbooks");
});
// UPDATE BOOK ROUTE
app.get("/updatebook", (req, res) => {
  let updatedBook = books.find((item) => item._id == req.query._id);
  res.render(__dirname + "/views/updatebook.ejs", { updatedBook });
});
app.post("/updatebook", urlencodedParser, (req, res) => {
  let updatedBook = books.find((item) => item._id == req.query._id);
  updatedBook.title = req.body.title;
  updatedBook.authors = req.body.authors;
  updatedBook.categories = req.body.categories;
  updatedBook.shortDescription = req.body.shortDescription;
  updatedBook.thumbnailUrl = req.body.thumbnailUrl;
  saveBooksData();
  res.redirect("/showbooks");
});

//   DELETE BOOK ROUTE
app.get("/deletebook", urlencodedParser, (req, res) => {
  let updatedBookIndex = books.findIndex((item) => item._id == req.query._id);
  books.splice(updatedBookIndex, 1);
  saveBooksData();
  res.redirect("/showbooks");
});

// save Data
function saveBooksData() {
  let data = JSON.stringify(books);
  fs.writeFile("books.json", data, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  fs.writeFile("settings.json", data, (err) => {
    if (err) throw err;
    console.log("The file has been saved2!");
  });
}

function readBooksData() {
  fs.readFile("books.json", (err, data) => {
    if (err) throw err;
    books = JSON.parse(data);
    console.log("The file has been Read!");
  });
  fs.readFile("settings.json", (err, data) => {
    if (err) throw err;
    books = JSON.parse(data);
    console.log("The file has been Read!");
  });
}

readBooksData();

app.listen("8080", () => {
  console.log("hello");
});
