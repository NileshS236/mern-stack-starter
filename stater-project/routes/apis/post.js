const express = require("express");
const passport = require("passport");
const router = express.Router();
const mongoose = require("mongoose");

// Models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Validator
const validatePostInput = require("../../validations/post");

// @route         GET apis/post
// @description   Get posts
// @access        PUBLIC
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    return res.status(404).json({ nopostsfound: "No posts found!" });
  }
});

// @route         GET apis/post/:id
// @description   Get posts
// @access        PUBLIC
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.json(post);
  } catch (err) {
    return res.status(404).json({ nopostfound: "No post found with that ID!" });
  }
});

// @route         POST apis/post
// @description   Create post
// @access        PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // try {
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user._id,
    });
    const post = await newPost.save();
    return res.json(post);
    // } catch (err) {
    //   return res.status(400).json(err);
    // }
  }
);

// @route         DELETE apis/post/:id
// @description   Delete post
// @access        PRIVATE
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user._id });
      const post = await Post.findById(req.params.id);
      if (post.user.toString() != req.user._id) {
        return res.status(401).json({ notauthorized: "User not Authorized." });
      }
      await post.remove();
      return res.json({ success: true });
    } catch (err) {
      return res.status(404).json({ postnotfound: "No post found" });
    }
  }
);

// @route         POST apis/post/like/:id
// @description   Like post
// @access        PRIVATE
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user._id });
      const post = await Post.findById(req.params.id);
      if (
        post.likes.filter((like) => like.user.toString() == req.user._id)
          .length > 0
      ) {
        return res
          .status(400)
          .json({ alreadyliked: "User already liked this post." });
      }
      // Add user id to likes array
      post.likes.unshift({ user: req.user._id });
      const likedPost = await post.save();
      return res.json(likedPost);
    } catch (err) {
      return res.status(404).json({ postnotfound: "No post found" });
    }
  }
);

// @route         POST apis/post/unlike/:id
// @description   Unlike post
// @access        PRIVATE
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user._id });
      const post = await Post.findById(req.params.id);
      if (
        post.likes.filter((like) => like.user.toString() == req.user._id)
          .length === 0
      ) {
        return res
          .status(400)
          .json({ notliked: "User has not liked this post." });
      }
      // Get remove index
      const removeIndex = post.likes
        .map((item) => item.user.toString())
        .indexOf(req.user._id);
      // Unlike post
      post.likes.splice(removeIndex, 1);
      // Save
      const unlikedPost = await post.save();
      return res.json(unlikedPost);
    } catch (err) {
      return res.status(404).json({ postnotfound: "No post found" });
    }
  }
);

// @route         POST apis/post/comment/:id
// @description   Add comment on a post
// @access        PRIVATE
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user._id,
      };
      // Add comment to the comments array
      post.comments.unshift(newComment);
      // Save
      const commentedPost = await post.save();
      return res.json(commentedPost);
    } catch (err) {
      return res.status(404).json({ postnotfound: "No post found" });
    }
  }
);

// @route         POST apis/post/comment/:id/:comment_id
// @description   Remove comment on a post
// @access        PRIVATE
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (
        post.comments.filter(
          (comment) => comment._id.toString() == req.params.comment_id
        ).length === 0
      ) {
        return res
          .status(400)
          .json({ commentnotexists: "Comment does not exists." });
      }
      // Get remove index
      const removeIndex = post.comments
        .map((item) => item._id.toString())
        .indexOf(req.params.comment_id);
      // Splice comment out of array
      post.comments.splice(removeIndex, 1);
      // Save
      const unCommentedPost = await post.save();
      return res.json(unCommentedPost);
    } catch (err) {
      return res.status(404).json({ postnotfound: "No post found" });
    }
  }
);

module.exports = router;
