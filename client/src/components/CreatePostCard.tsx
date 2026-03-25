import { Box, Button, Card, CardContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";

export function CreatePostCard({
  onCreate,
  busy,
}: {
  busy: boolean;
  onCreate: (args: { text: string; file: File | null }) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const canPost = Boolean(text.trim() || file) && !busy;

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.25}>
          <Typography fontWeight={700}>Create Post</Typography>
          <TextField
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

          {file ? (
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary" noWrap>
                {file.name}
              </Typography>
              <IconButton size="small" aria-label="remove image" onClick={() => setFile(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : null}

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <IconButton
                size="small"
                aria-label="add image"
                onClick={() => fileRef.current?.click()}
              >
                <ImageOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Button
              variant="contained"
              disabled={!canPost}
              onClick={async () => {
                await onCreate({ text: text.trim(), file });
                setText("");
                setFile(null);
              }}
            >
              Post
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

