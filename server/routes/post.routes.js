const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const User= mongoose.model("User")
// // const brcrypt = require("bcryptjs")
// // const jwt = require("jsonwebtoken")
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id username profilePicUrl")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.put("/post", requireLogin, (req, res, next) => {
    const { id } = req.query; // Extracting _id from URL params
    const { likes } = req.body; // Extracting likes from request body
  
    // Checking if likes is provided in the request body
    if (likes === undefined) {
      return res.status(400).json({ error: "Likes value is required" });
    }
  
    Post.findById(id) // Using findById for simplicity
      .then((post) => {
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }
  
        // Updating the likes field of the post
        post.likes = likes;
        return post.save();
      })
      .then((updatedPost) => {
        res.json({ message: "Likes updated successfully", post: updatedPost });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, imageUrl } = req.body;
  if (!title || !body || !imageUrl) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user.password = null;
  const user = req.user;
  // res.send("okay")
  const post = new Post({
    title,
    body,
    imageUrl,
    postedBy: user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name username profilePicUrl")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.put("/like", requireLogin, async (req, res, next) => {
  console.log(req.user);
  try {
    const post = await Post.findById(req.body.id);

    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(req.user._id);

    if (hasLiked) {
      return res.status(422).json({ error: "You have already liked this post" });
    }

    post.likes.push(req.user._id);
    await post.save();

    return res.json({ message: "Post liked successfully", post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});





router.put("/unlike", requireLogin, async (req, res, next) => {
  console.log(req.user);
  try {
    const post = await Post.findById(req.body.id);

    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const hasUnliked = post.likes.includes(req.user._id);

    if (!hasUnliked) {
      return res.status(422).json({ error: "You have already unliked this post" });
    }

    post.likes.pull(req.user._id);
    await post.save();

    return res.json({ message: "Post unliked successfully", post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;