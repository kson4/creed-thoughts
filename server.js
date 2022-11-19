const express = require("express");
const app = express();
const mongoDB = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "creed-thoughts";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
      const featured = posts.filter((post) => post.featured === true);
      res.render("index.ejs", { posts: posts, featured: featured });
    });
});

app.get("/post/:id", (req, res) => {
  const obj = new mongoDB.ObjectId(req.params.id);

  db.collection("posts")
    .findOne({ _id: obj })
    .then((post) => {
      res.render("post.ejs", { post: post });
    });
});

const PORT = 5000;
app.listen(PORT, (req, res) => {
  console.log(`Server is listening on port: ${PORT}`);
});
