import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  TextareaAutosize,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/lib/createTheme";

const musicianTypes = [
  "Pianist",
  "Guitarist",
  "Drummer",
  "Soundwriter",
  "Vocalist",
  "Producer",
];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    musicianType: "",
    goal: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.musicianType ||
      !formData.goal
    ) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to register user.");

      const data = await response.json();
      alert("Registration successful!");
    } catch (error) {
      console.error(error);
      alert("Failed to register user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 400,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Зарегистрироваться{" "}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Имя"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              label="Какой вы музыкант"
              variant="outlined"
              name="musicianType"
              value={formData.musicianType}
              onChange={handleInputChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
            >
              {musicianTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Цель как музыканта{" "}
            </Typography>
            <TextareaAutosize
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              placeholder="Опишите свою цель..."
              minRows={4}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                borderColor: "white",
                color: "white",
                padding: "10px",
                borderRadius: "4px",
              }}
              required
            />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Зарегистрироваться"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
