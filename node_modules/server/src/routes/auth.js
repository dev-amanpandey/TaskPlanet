const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { signToken } = require("../lib/auth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body || {};
    if (!email || !password || !username) {
      return res.status(400).json({ message: "email, username and password are required" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() }).lean();
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      email: String(email).toLowerCase(),
      username: String(username).trim(),
      passwordHash,
    });

    const token = signToken(user);
    return res.json({
      token,
      user: { userId: String(user._id), email: user.email, username: user.username },
    });
  } catch (err) {
    return res.status(500).json({ message: "Signup failed" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      token,
      user: { userId: String(user._id), email: user.email, username: user.username },
    });
  } catch {
    return res.status(500).json({ message: "Login failed" });
  }
});

module.exports = { authRouter };

