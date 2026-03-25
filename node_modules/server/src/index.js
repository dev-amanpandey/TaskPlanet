const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDb } = require("./lib/db");
const { authRouter } = require("./routes/auth");
const { postsRouter } = require("./routes/posts");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json({ limit: "8mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);

const port = Number(process.env.PORT || 4000);

connectDb()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", err);
    process.exit(1);
  });

