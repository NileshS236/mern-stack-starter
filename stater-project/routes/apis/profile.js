const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");

// Models
const Profile = require("../../models/Profile"); // Profile
const User = require("../../models/User"); // User

//Load Validation
const validateProfileInput = require("../../validations/profile");
const validateExperienceInput = require("../../validations/experience");
const validateEducationInput = require("../../validations/education");

// @route         GET apis/profile/test
// @description   Test profile route
// @access        PUBLIC
router.get("/test", (req, res) => res.json({ msg: "Profile API Worked" }));

// @route         GET apis/profile
// @description   Get current user's profile
// @access        PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      const profile = await Profile.findOne({
        user: req.user._id,
      }).populate("user", ["name", "avatar"]);
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      return res.json(profile);
    } catch (err) {
      return res.status(404).json(err);
    }
  }
);

// @route         GET apis/profile/all
// @description   Get all profiles
// @access        PUBLIC
router.get("/all", async (req, res) => {
  const errors = {};

  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles.length) {
      errors.noprofiles = "There are no profiles!";
      return res.status(404).json(errors);
    }
    return res.json(profiles);
  } catch (err) {
    errors.noprofiles = "There are no profiles!";
    return res.status(404).json(errors);
  }
});

// @route         GET apis/profile/handle/:handle
// @description   Get profile by handle
// @access        PUBLIC
router.get("/handle/:handle", async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      handle: req.params.handle,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      errors.noprofile = "There is no profile for this user.";
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (err) {
    return res.status(404).json(err);
  }
});

// @route         GET apis/profile/user/:user_id
// @description   Get profile by user ID
// @access        PUBLIC
router.get("/user/:user_id", async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      errors.noprofile = "There is no profile for this user.";
      return res.status(404).json(errors);
    }
    return res.json(profile);
  } catch (err) {
    errors.noprofile = "There is no profile for this user.";
    return res.status(404).json(errors);
  }
});

// @route         POST apis/profile
// @description   Create and Update user profile
// @access        PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // console.log(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get Fields
    const profileFields = {};
    profileFields.user = req.user._id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.loaction) profileFields.loaction = req.body.loaction;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - split into array
    if (typeof req.body.skills !== undefined)
      profileFields.skills = req.body.skills.split(",");
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social = req.body.youtube;
    if (req.body.twitter) profileFields.social = req.body.twitter;
    if (req.body.facebook) profileFields.social = req.body.facebook;
    if (req.body.linkedin) profileFields.social = req.body.linkedin;
    if (req.body.instagram) profileFields.social = req.body.instagram;

    try {
      const profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        // Update
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(updatedProfile);
      } else {
        // Create

        // Check if handle exists
        const profile = await Profile.findOne({ handle: profileFields.handle });
        if (profile) {
          errors.handle = "That handle already exists.";
          return res.status(400).json(errors);
        }

        // Save Profile
        const newProfile = await new Profile(profileFields);
        newProfile.save();
        return res.json(newProfile);
      }
    } catch (error) {
      console.log(profileFields.user);
      console.log(error);
    }
  }
);

// @route         POST apis/profile/experience
// @description   Add experience to profile
// @access        PRIVATE
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profile = await Profile.findOne({ user: req.user._id });
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    // Add to profile
    profile.experience.unshift(newExp);
    const newProfile = await profile.save();
    return res.json(newProfile);
  }
);

// @route         POST apis/profile/education
// @description   Add education to profile
// @access        PRIVATE
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profile = await Profile.findOne({ user: req.user._id });
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    // Add to profile
    profile.education.unshift(newEdu);
    const newProfile = await profile.save();
    return res.json(newProfile);
  }
);

// @route         DELETE apis/profile/experience/:exp_id
// @description   Delete experience from profile
// @access        PRIVATE
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      const profile = await Profile.findOne({ user: req.user._id });
      // Get remmove index
      const removeIndex = profile.experience
        .map((item) => item._id)
        .indexOf(req.params.exp_id);

      // Splice out of array
      if (removeIndex !== -1) profile.experience.splice(removeIndex, 1);
      else {
        errors.noexp = "Experience entry not found!";
        return res.status(404).json(errors);
      }

      // Save
      const newProfile = await profile.save();
      return res.json(newProfile);
    } catch (err) {
      return res.status(404).json(err);
    }
  }
);

// @route         DELETE apis/profile/education/:edu_id
// @description   Delete education from profile
// @access        PRIVATE
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      const profile = await Profile.findOne({ user: req.user._id });
      // Get remmove index
      const removeIndex = profile.education
        .map((item) => item._id)
        .indexOf(req.params.edu_id);

      // Splice out of array
      if (removeIndex !== -1) profile.education.splice(removeIndex, 1);
      else {
        errors.noedu = "Education entry not found!";
        return res.status(404).json(errors);
      }

      // Save
      const newProfile = await profile.save();
      return res.json(newProfile);
    } catch (err) {
      return res.status(404).json(err);
    }
  }
);

// @route         DELETE apis/profile/
// @description   Delete profile and user
// @access        PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Profile.findOneAndRemove({ user: req.user._id });
    await User.findOneAndRemove({ _id: req.user._id });
    return res.json({ success: true });
  }
);

module.exports = router;
