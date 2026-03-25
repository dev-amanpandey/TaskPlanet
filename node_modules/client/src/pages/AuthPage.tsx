import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

export function AuthPage() {
  const { login, signup, token } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === "login" ? "Welcome back" : "Create your account"), [mode]);

  if (token) {
    navigate("/", { replace: true });
  }

  async function onSubmit() {
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") await login({ email, password });
      else await signup({ email, username, password });
      navigate("/", { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100%", display: "flex", alignItems: "center", py: 6 }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Stack spacing={2.25}>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {title}
                </Typography>
                <Typography color="text.secondary">
                  TaskPlanet-style mini social feed.
                </Typography>
              </Box>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Stack spacing={1.5}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  fullWidth
                />
                {mode === "signup" ? (
                  <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    fullWidth
                  />
                ) : null}
                <TextField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  type="password"
                  fullWidth
                />
              </Stack>

              <Button
                variant="contained"
                size="large"
                onClick={onSubmit}
                disabled={busy || !email || !password || (mode === "signup" && !username)}
              >
                {mode === "login" ? "Login" : "Sign up"}
              </Button>

              <Divider />

              <Typography color="text.secondary">
                {mode === "login" ? "New here?" : "Already have an account?"}{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode(mode === "login" ? "signup" : "login");
                  }}
                >
                  {mode === "login" ? "Create an account" : "Login"}
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

