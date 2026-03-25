const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, trim: true, maxlength: 1000 },

    // Store images inline to keep to 2 collections.
    // Data URL format: "data:image/png;base64,...."
    imageDataUrl: { type: String },

    likes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
      },
    ],

    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1, _id: -1 });

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };

