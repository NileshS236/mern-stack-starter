const express = require("express");
const router = express.Router();

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");
// Load Input Validations
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");

const User = require("../../models/User");

// @route         GET apis/user/test
// @description   Test user route
// @access        PUBLIC
router.get("/test", (req, res) => {
  res.json({ msg: "User API Worked" });
});

// @route         POST apis/user/register
// @description   Register user
// @access        PUBLIC
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    errors.email = "Email already exists";
    return res.status(400).json(errors);
  } else {
    const avatar = gravatar.url(req.body.email, {
      s: "200", // Size
      r: "pg", // Rating
      d: "mm", // Default
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        try {
          const user = await newUser.save();
          return res.json(user);
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
});

// @route         POST apis/user/login
// @description   Login User / Return JSON WEB TOKEN(JWT)
// @access        PUBLIC
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  const user = await User.findOne({ email });
  //Check for user
  if (!user) {
    errors.email = "User not found";
    return res.status(404).json(errors);
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // isMatched
    // res.json({ msg: "Success" });

    const payload = { id: user._id, name: user.name, avatar: user.avatar }; // Create JWT payload
    jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
      res.json({
        success: true,
        token: `Bearer ${token}`,
      });
    }); // Assign token
  } else {
    errors.password = "Incorrect Password.";
    return res.status(400).json(errors);
  }
});

// @route         GET apis/user/current
// @description   Current User
// @access        PRIVATE
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
