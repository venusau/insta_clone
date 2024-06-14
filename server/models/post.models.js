const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    comments: {
      type: [String],
      default: [""],
    },
    likes: [{
      type: ObjectId,
      ref: "User"
    }],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  });

mongoose.model("Post", postSchema);
