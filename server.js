const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "creed-thoughts";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

app.get("/", (req, res) => {
  db.collection("posts")
    .find()
    .toArray()
    .then((posts) => {
      res.render("index.ejs", { posts: posts });
    });
});

app.get("/post", (req, res) => {
  db.collection("posts")
    .find()
    .toArray()
    .then((posts) => {
      res.render("post.ejs", { posts: posts });
    });
});

const PORT = 5000;
app.listen(PORT, (req, res) => {
  console.log(`server is listening on port: ${PORT}`);
});
