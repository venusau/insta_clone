const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const User= mongoose.model("User")
// // const brcrypt = require("bcryptjs")
// // const jwt = require("jsonwebtoken")
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

// Helper function for error responses
const handleError = (res, err, message = "Internal server error", statusCode = 500) => {
  console.error(err);
  return res.status(statusCode).json({ error: message });
};

// Route to get all posts
router.get("/allpost", requireLogin, async (req, res) => {
  try {
    const posts = await Post.find().populate("postedBy", "_id username profilePicUrl");
    res.json({ posts });
  } catch (err) {
    handleError(res, err);
  }
});

// Route to create a new post
router.post("/createpost", requireLogin, async (req, res) => {
  const { title, body, imageUrl } = req.body;
  if (!title || !body || !imageUrl) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    req.user.password = null;
    const post = new Post({
      title,
      body,
      imageUrl,
      postedBy: req.user,
    });
    const result = await post.save();
    res.json({ post: result });
  } catch (err) {
    handleError(res, err);
  }
});

// Route to get user's posts
router.get("/mypost", requireLogin, async (req, res) => {
  try {
    const myposts = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name username profilePicUrl");
    res.json({ myposts });
  } catch (err) {
    handleError(res, err);
  }
});

// Route to update likes on a post
router.put("/post", requireLogin, async (req, res) => {
  const { id } = req.query;
  const { likes } = req.body;

  if (likes === undefined) {
    return res.status(400).json({ error: "Likes value is required" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.likes = likes;
    const updatedPost = await post.save();
    res.json({ message: "Likes updated successfully", post: updatedPost });
  } catch (err) {
    handleError(res, err);
  }
});

// Route to like a post
router.put("/like", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);
    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(422).json({ error: "You have already liked this post" });
    }

    post.likes.push(req.user._id);
    await post.save();
    res.json({ message: "Post liked successfully", post });
  } catch (err) {
    handleError(res, err);
  }
});

// Route to unlike a post
router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);
    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(422).json({ error: "You have already unliked this post" });
    }

    post.likes.pull(req.user._id);
    await post.save();
    res.json({ message: "Post unliked successfully", post });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
