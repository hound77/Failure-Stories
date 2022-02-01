if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dbUrl = process.env.dbUrl;
const PORT = process.env.PORT || 3000;

// creating database
mongoose.connect(dbUrl, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false});

const aboutContent = "Node.js was used to create the back-end of this app. Mongodb is used to store the blogs. HTML & CSS were used for the front-end. Written using Express.js, it was styled using Bootstrap and Embedded JS. It is hosted on Heroku.";

const app = express();

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const a = mongoose.Schema({
  title: String,
  content: String
});

const posts = mongoose.model("Blog",a);

const first = {
  title: "first' ",
  content: "the way the"
};

const second = {
  title: "san22' ",
  content: "yhrjf"
};

const defaultBlogs = [first,second];

app.get("/", async (req, res) => {
  try {
    const results = await posts.find({});
    if (results.length == 0) {
      await posts.insertMany(defaultBlogs);
      return res.redirect("/");
    } else {
      const renderData = {
        postsData: results,
      };
      res.render("home", renderData);
    }
  } catch (err) {
    console.log(err);
  }
});


app.get("/about", (req,res)=>
{
  var renderData =
  {
    about : aboutContent
  };
  res.render("about.ejs", renderData);
});

app.get("/contact", (req,res)=>
{
  res.render("contact.ejs");
});

app.get("/compose", (req,res) =>
{
  res.render("compose.ejs");
});

app.get("/posts/:id", (req,res) =>
{
  let requested = req.params.id ;

  posts.findOne( {
    _id: requested
  },
  function(err,post) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      const renderData =
      {
        data : post
      };
      res.render("post",renderData);
    }
  });
});

app.post("/compose", (req,res) =>
{
  const post = new posts({
    title: req.body.composeTitle ,
    content: req.body.composeContent
  });

  post.save() ;

  res.redirect("/");
});

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
