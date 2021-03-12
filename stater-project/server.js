const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const env = require("dotenv");

// Importing routers
const user = require("./routes/apis/user");
const post = require("./routes/apis/post");
const profile = require("./routes/apis/profile");

env.config();
const app = express();

// body-parser moddlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Declaring Database
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Passport Middleware
app.use(passport.initialize());
// Passport Config
require("./config/passport")(passport);

// Middlewares
app.use("/apis/user", user);
app.use("/apis/posts", post);
app.use("/apis/profile", profile);

app.get("/", (req, res) => {
  res.send("Up n Runnin!!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server running on port " + port);
});
