import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Box, Typography, TextField } from "@mui/material";
import theme from "@/lib/createTheme";
import { ThemeProvider } from "@emotion/react";
import { observer } from "mobx-react-lite";
import userStore from "@/app/store/userStore";

const DashboardComponent = observer(() => {
  const router = useRouter();
  const { user, clearUser } = userStore;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userStore.isLoggedIn()) {
      router.push("/sign-in");
    }
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return alert("Please select a file to upload.");
    }

    const formData = new FormData();
    formData.append("track", file);
    formData.append("userId", user._id);

    setUploading(true);

    try {
      const response = await fetch("/api/users/uploadTrack", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Track uploaded successfully");
      } else {
        alert("Error uploading track: " + data.error);
      }
    } catch (error) {
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
      <div>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Button onClick={handleLogout} variant="contained" color="secondary">
            Выйти
          </Button>
        </Box>
        <h1>Привет, {user?.name || "Гость"}!</h1>
        <Typography variant="h6">Опубликуй свою демку</Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            type="file"
            onChange={handleFileChange}
            variant="outlined"
            fullWidth
            label="Select Track"
            sx={{ mb: 2 }}
          />
          {fileName && <Typography>{fileName}</Typography>}
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Track"}
          </Button>
        </Box>
      </div>
    </ThemeProvider>
  );
});

const Dashboard = dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
});

export default Dashboard;
