const express = require("express");
const multer = require("multer");

const { requireAuth } = require("../lib/auth");
const { Post } = require("../models/Post");

const postsRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

function toDataUrl(file) {
  if (!file) return null;
  const mime = file.mimetype || "application/octet-stream";
  const base64 = file.buffer.toString("base64");
  return `data:${mime};base64,${base64}`;
}

postsRouter.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 10), 30);
  const cursorCreatedAt = req.query.cursorCreatedAt ? new Date(String(req.query.cursorCreatedAt)) : null;
  const cursorId = req.query.cursorId ? String(req.query.cursorId) : null;

  const query = {};
  if (cursorCreatedAt && cursorId) {
    query.$or = [
      { createdAt: { $lt: cursorCreatedAt } },
      { createdAt: cursorCreatedAt, _id: { $lt: cursorId } },
    ];
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = posts.length > limit;
  const page = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore
    ? { cursorCreatedAt: page[page.length - 1].createdAt, cursorId: String(page[page.length - 1]._id) }
    : null;

  return res.json({
    items: page.map((p) => ({
      ...p,
      _id: String(p._id),
      userId: String(p.userId),
      likesCount: p.likes?.length || 0,
      commentsCount: p.comments?.length || 0,
      likes: p.likes || [],
      comments: p.comments || [],
    })),
    nextCursor,
  });
});

postsRouter.post("/", requireAuth, upload.single("image"), async (req, res) => {
  const text = (req.body?.text || "").trim();
  const imageDataUrl = req.file ? toDataUrl(req.file) : (req.body?.imageDataUrl || null);

  if (!text && !imageDataUrl) {
    return res.status(400).json({ message: "Post must include text or an image" });
  }

  const post = await Post.create({
    userId: req.user.userId,
    username: req.user.username,
    text: text || undefined,
    imageDataUrl: imageDataUrl || undefined,
    likes: [],
    comments: [],
  });

  return res.json({
    post: {
      _id: String(post._id),
      userId: String(post.userId),
      username: post.username,
      text: post.text,
      imageDataUrl: post.imageDataUrl,
      likesCount: 0,
      commentsCount: 0,
      likes: [],
      comments: [],
      createdAt: post.createdAt,
    },
  });
});

postsRouter.post("/:id/like", requireAuth, async (req, res) => {
  const postId = String(req.params.id);
  const userId = String(req.user.userId);
  const username = String(req.user.username);

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const idx = post.likes.findIndex((l) => String(l.userId) === userId);
  if (idx >= 0) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push({ userId, username });
  }
  await post.save();

  return res.json({
    likesCount: post.likes.length,
    likedBy: post.likes,
  });
});

postsRouter.post("/:id/comment", requireAuth, async (req, res) => {
  const postId = String(req.params.id);
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ message: "Comment text required" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({
    userId: req.user.userId,
    username: req.user.username,
    text,
  });
  await post.save();

  const last = post.comments[post.comments.length - 1];
  return res.json({
    commentsCount: post.comments.length,
    comment: {
      _id: String(last._id),
      userId: String(last.userId),
      username: last.username,
      text: last.text,
      createdAt: last.createdAt,
    },
  });
});

module.exports = { postsRouter };

