import { Box, Button, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { TopBar } from "../components/TopBar";
import { CreatePostCard } from "../components/CreatePostCard";
import { PostCard } from "../components/PostCard";
import { api } from "../lib/api";
import type { FeedResponse, Post } from "../types";
import { useAuth } from "../state/auth";

type Cursor = FeedResponse["nextCursor"];

export function FeedPage() {
  const { logout } = useAuth();
  const [tab, setTab] = useState(0);

  const [items, setItems] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [busy, setBusy] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const canLoadMore = useMemo(() => Boolean(cursor), [cursor]);

  async function loadFirstPage() {
    setBusy(true);
    try {
      const res = await api.get<FeedResponse>("/posts", { params: { limit: 10 } });
      setItems(res.data.items);
      setCursor(res.data.nextCursor);
    } finally {
      setBusy(false);
    }
  }

  async function loadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await api.get<FeedResponse>("/posts", {
        params: { limit: 10, cursorCreatedAt: cursor.cursorCreatedAt, cursorId: cursor.cursorId },
      });
      setItems((prev) => [...prev, ...res.data.items]);
      setCursor(res.data.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadFirstPage().catch(() => {});
  }, []);

  async function createPost(args: { text: string; file: File | null }) {
    const form = new FormData();
    if (args.text) form.append("text", args.text);
    if (args.file) form.append("image", args.file);

    const res = await api.post("/posts", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setItems((prev) => [res.data.post as Post, ...prev]);
  }

  async function toggleLike(postId: string) {
    // optimistic
    setItems((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const me = JSON.parse(localStorage.getItem("tp_user") || "null") as { userId: string; username: string } | null;
        if (!me) return p;
        const already = p.likes.some((l) => l.userId === me.userId);
        const likes = already ? p.likes.filter((l) => l.userId !== me.userId) : [...p.likes, me];
        return { ...p, likes, likesCount: likes.length };
      })
    );

    try {
      const res = await api.post(`/posts/${postId}/like`);
      setItems((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likesCount: res.data.likesCount, likes: res.data.likedBy } : p
        )
      );
    } catch {
      // revert by refetching that page (simple + reliable for mini-app)
      loadFirstPage().catch(() => {});
    }
  }

  async function addComment(postId: string, text: string) {
    // optimistic
    const tempId = `temp_${Date.now()}`;
    const me = JSON.parse(localStorage.getItem("tp_user") || "null") as { userId: string; username: string } | null;

    setItems((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const optimistic = me
          ? { _id: tempId, userId: me.userId, username: me.username, text, createdAt: new Date().toISOString() }
          : { _id: tempId, userId: "me", username: "You", text, createdAt: new Date().toISOString() };
        return { ...p, comments: [...p.comments, optimistic], commentsCount: p.commentsCount + 1 };
      })
    );

    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setItems((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const comments = p.comments.map((c) => (c._id === tempId ? res.data.comment : c));
          return { ...p, comments, commentsCount: res.data.commentsCount };
        })
      );
    } catch {
      loadFirstPage().catch(() => {});
    }
  }

  return (
    <Box>
      <TopBar />
      <Container maxWidth="sm" sx={{ pb: 10 }}>
        <Stack spacing={1.5} sx={{ pt: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={900}>
              Social
            </Typography>
            <Button size="small" variant="text" onClick={logout}>
              Logout
            </Button>
          </Stack>

          <CreatePostCard busy={busy} onCreate={createPost} />

          <Tabs
            value={tab}
            onChange={(_e, v) => setTab(v)}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 999,
              px: 0.5,
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          >
            <Tab label="All Posts" />
            <Tab label="Promotion" disabled />
          </Tabs>

          <Stack spacing={1.5}>
            {items.map((p) => (
              <PostCard key={p._id} post={p} onToggleLike={toggleLike} onAddComment={addComment} />
            ))}
          </Stack>

          <Stack direction="row" justifyContent="center" sx={{ pt: 1 }}>
            {canLoadMore ? (
              <Button variant="outlined" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {items.length ? "You're all caught up." : "No posts yet."}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

