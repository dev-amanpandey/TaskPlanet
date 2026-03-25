import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useMemo, useState } from "react";
import type { Post } from "../types";
import { useAuth } from "../state/auth";

export function PostCard({
  post,
  onToggleLike,
  onAddComment,
}: {
  post: Post;
  onToggleLike: (postId: string) => Promise<void>;
  onAddComment: (postId: string, text: string) => Promise<void>;
}) {
  const { user } = useAuth();
  const [openComments, setOpenComments] = useState(false);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const liked = useMemo(
    () => Boolean(user && post.likes?.some((l) => l.userId === user.userId)),
    [post.likes, user]
  );

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>{post.username.slice(0, 1).toUpperCase()}</Avatar>
              <Box>
                <Typography fontWeight={800} lineHeight={1.1}>
                  {post.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
            <Button size="small" variant="outlined" sx={{ borderRadius: 999 }}>
              Follow
            </Button>
          </Stack>

          {post.text ? (
            <Typography sx={{ whiteSpace: "pre-wrap" }}>{post.text}</Typography>
          ) : null}

          {post.imageDataUrl ? (
            <Box
              component="img"
              src={post.imageDataUrl}
              alt="post"
              sx={{
                width: "100%",
                borderRadius: 3,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                maxHeight: 420,
                objectFit: "cover",
              }}
            />
          ) : null}

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={`${post.likesCount} Likes`} />
              <Chip size="small" label={`${post.commentsCount} Comments`} />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                size="small"
                aria-label="like"
                onClick={() => onToggleLike(post._id)}
                color={liked ? "primary" : "default"}
              >
                {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
              <IconButton size="small" aria-label="comments" onClick={() => setOpenComments((s) => !s)}>
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Collapse in={openComments} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  disabled={busy || !comment.trim()}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await onAddComment(post._id, comment.trim());
                      setComment("");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Send
                </Button>
              </Stack>

              <Stack spacing={1}>
                {post.comments?.slice().reverse().slice(0, 5).map((c) => (
                  <Box key={c._id} sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(15, 23, 42, 0.03)" }}>
                    <Typography variant="body2" fontWeight={700}>
                      {c.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                      {c.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}

