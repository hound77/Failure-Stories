if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dbUrl = process.env.dbUrl || "mongodb://localhost:27017/secretsDB";

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
  title: "Movie Review - 'Coherence' ",
  content: " Ever heard of the terms alternate realities, parallel universes, or Schrodinger's cat? Ever thought that a movie without involving any ghosts could scare you? Well, welcome to the world of Sci-Fi Thrillers. If you are a fan of the mind-fuck genre, which gave us movies like Predestination, Memento & Shutter Island, well, guess what, Coherence is for you So, let's start with a spoiler-free review.  In a get together of 8 friends, strange things start happening when a comet passes over them in the sky. A complete blackout and a network loss accompanied by their personal issues make them do some strange activities. Bizarre things keep happening to them as a result. The friends keep getting confused. The theoretical concept of 'alternate realities' seems to be the only explanation for the unusual things. By the time they realize what's happening, some irreversible changes have taken place. Anything more I say will spoil the movie for you. The movie is fantastic. It explains the scarier facts of the otherwise fascinating concepts of 'Schrodinger's cat' and 'Alternate Realities'. When I first heard of the concepts, I was like that's some cool stuff. But the movie showed me how dangerous can they be. The climax of the movie was a shocking realization for both the protagonist and the viewer. Upon enlightenment, the protagonist takes some steps which will forever change her life. I was initially watching the movie at night with lights out. But as I reached the climax, I had to switch on the lights as I was a bit scared. The movie doesn't end in an 'everything is ok now' tone, which may be the reason some may not like it. But the end was realistic and scary. And that's why I recommend it to those who like to make their brain work while watching a movie."
};

const second = {
  title: "Movie Review - '12 Angry Men' ",
  content: "The movie is about an 18-year old who is charged with the case of killing his own father in his own home. He was arrested at the murder point 3 hours after the killing took place on the assumption that he had come to retrieve the murder weapon. A trial takes place off-screen and the crystal clear pieces of evidence suggest that he is guilty. Though the case seems pretty straightforward, to follow the law, the final decision of whether or not the boy is guilty is left upon a jury of 12 men. The prime story of the movie is to give an answer regarding the victim's guiltiness. Not giving out spoilers, 11 men of the jury agree with the decision of the court (that being guilty), while the remaining man believes that it's not okay to send someone to die without properly discussing his blame-worthiness. As the movie progresses, he tries to convince the others that the case isn't as simple as it seems. When I heard that the whole movie is shot in just a single room, I was like, ' No way, I am watching it'. Let's just agree to it. No one in the 21st century would like to watch a 60-year-old black and white movie which is set in a single room. Yes, the movie shows no hacking, no action scenes, no car chases and not even a single actress. But when I saw its cent percent rating on Rotten Tomatoes, I was like, 'Why not give it a watch?' as the rating website rarely gives any movie 100%. And boy, the movie didn't dissatisfy me even a bit. Despite being presented in a single room, the thrill with which it keeps the viewers glued to the screen is outstanding. As the movie advances, just like the other 11 jurors, we also feel that the case isn't that simple. Though we don't get as angry as they get. There was only one thing about the movie that I didn't like which can't be shared as it's a spoiler. Otherwise, the movie is pretty good To someone who likes thrillers and murder cases, this movie is for you. If you like legal drama, it's a must-watch. And one of the best parts about the movie is that it's not as long as most of the movies of the 50s are. So, grab some popcorn and spend the next 95 minutes of your life as the 13th Juror."
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

// app.get("/", (req,res)=> {
//   posts.find( {}, function(err,results) {
//       if(err)
//       {
//         console.log(err);
//       }
//       else
//       {
//         if(results.length === 0)
//         {
//           posts.insertMany(defaultBlogs,function(err){
//             if(err)
//             {
//               console.log(err);
//             }
//           });
//           res.redirect("/");
//         }
//         else
//         {
//           var renderData =
//           {
//             postsData : results
//           };
//           res.render("home", renderData);
//         }
//       }
//     });
// });

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

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
