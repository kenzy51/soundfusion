import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import theme from "@/lib/createTheme";
import { observer } from "mobx-react-lite";
import userStore from "@/app/store/userStore";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LogoutIcon from "@mui/icons-material/Logout";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ResponsiveAppBar from "@/widgets/appBar/AppBar";

const DashboardComponent = observer(() => {
  const router = useRouter();
  const { user, clearUser } = userStore;
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    if (!userStore.isLoggedIn()) {
      router.push("/sign-in");
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return alert("Please select a file to upload.");
    }

    const formData = new FormData();
    formData.append("track", file);
    formData.append("userId", user?.id);
    formData.append("title", title); // Add title to form data
    formData.append("genre", genre); // Add genre to form data

    setUploading(true);

    try {
      const response = await fetch("/api/users/uploadTrack", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Track uploaded successfully");
      } else {
        alert("Error uploading track: " + data.error);
      }
    } catch (error: any) {
      alert("Error uploading track: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    clearUser();
    router.push("/sign-in");
  };

  return (
    <ThemeProvider theme={theme}>
      <ResponsiveAppBar />
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.default,
          padding: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, maxWidth: 700, width: "100%", borderRadius: 3 }}
        >
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid
                  item
                  xs={12}
                  sm={4}
                  display="flex"
                  justifyContent="center"
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      backgroundColor: theme.palette.primary.main,
                      fontSize: 40,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h4" gutterBottom>
                    Привет, {user?.name || "Гость"}!
                  </Typography>
                  {user?.goal && (
                    <Typography variant="body1" color="textSecondary">
                      Твоя цель: <strong>{user.goal}</strong>
                    </Typography>
                  )}
                  {user?.preferredMusicGenre && (
                    <Chip
                      icon={<MusicNoteIcon />}
                      label={`Любимый жанр: ${user.preferredMusicGenre}`}
                      color="primary"
                      sx={{ marginTop: 1 }}
                    />
                  )}
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 3 }} />

              {/* Track Upload */}
              <Grid container spacing={2}>
                {user?.instagram && (
                  <Grid item xs={12}>
                    <Tooltip title="Перейти в Instagram" arrow>
                      <Button
                        sx={{ color: "white" }}
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        startIcon={<InstagramIcon />}
                        onClick={() =>
                          window.open(
                            `https://instagram.com/${user.instagram.slice(1)}`,
                            "_blank"
                          )
                        }
                      >
                        Instagram: {user.instagram}
                      </Button>
                    </Tooltip>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Опубликуй свою демку
                  </Typography>

                  {/* Title Input */}
                  <TextField
                    label="Название трека"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ marginBottom: 2 }}
                  />

                  {/* Genre Input */}
                  <TextField
                    label="Жанр"
                    variant="outlined"
                    fullWidth
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    sx={{ marginBottom: 2 }}
                  />

                  {/* File Input */}
                  <TextField
                    type="file"
                    onChange={handleFileChange}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Выбери трек"
                    inputProps={{ accept: ".mp3" }}
                  />
                  {fileName && (
                    <Typography
                      align="center"
                      color="textSecondary"
                      sx={{ marginTop: 1 }}
                    >
                      {fileName}
                    </Typography>
                  )}

                  {/* Upload Button */}
                  <Button
                    onClick={handleUpload}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={uploading}
                    startIcon={
                      uploading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <UploadFileIcon />
                      )
                    }
                    sx={{ marginTop: 2 }}
                  >
                    {uploading ? "Загружается..." : "Загрузить трек"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>

            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                sx={{ color: "white" }}
                onClick={handleLogout}
                variant="outlined"
                color="secondary"
                startIcon={<LogoutIcon />}
                fullWidth
              >
                Выйти
              </Button>
            </CardActions>
          </Card>
        </Paper>
      </Box>
    </ThemeProvider>
  );
});

const Dashboard = dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
});

export default Dashboard;
