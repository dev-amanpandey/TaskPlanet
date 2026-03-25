import { AppBar, Avatar, Box, IconButton, InputBase, Stack, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuth } from "../state/auth";

export function TopBar() {
  const { user } = useAuth();

  return (
    <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: "blur(10px)" }}>
      <Toolbar sx={{ py: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: "100%" }}>
          <Box sx={{ flex: 1, position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 1,
                borderRadius: 999,
                bgcolor: "background.paper",
                border: "1px solid rgba(15, 23, 42, 0.08)",
              }}
            >
              <SearchIcon fontSize="small" />
              <InputBase placeholder="Search promotions, users..." sx={{ flex: 1, fontSize: 14 }} />
            </Box>
          </Box>

          <IconButton aria-label="theme" size="small">
            <DarkModeOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="account" size="small">
            <PersonOutlineIcon fontSize="small" />
          </IconButton>
          <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: 12 }}>
            {user?.username?.slice(0, 1).toUpperCase() || "U"}
          </Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

