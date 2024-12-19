import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  TextareaAutosize,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/lib/createTheme";
import { useRouter } from "next/router";

const musicianTypes = [
  { value: "Pianist", label: "Пианист" },
  { value: "Guitarist/Bass", label: "Гитарист/Басист" },
  { value: "Drummer", label: "Барабанщик" },
  { value: "Songwriter", label: "Композитор" },
  { value: "Vocalist", label: "Вокалист" },
  { value: "Producer", label: "Продюсер" },
  { value: "No skills", label: "Без навыков" },
  { value: "Violinst", label: "Скрипач" },
  { value: "Wind instruments", label: "Духовые инструменты" },
  { value: "Other", label: "Другое" },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    musicianType: "",
    goal: "",
    instagram: "",
    preferredMusicGenre: "",
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMusicianTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, musicianType: e.target.value });
  };
  const router = useRouter();

  const goToSignIn = () => {
    router.push("/sign-in");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.musicianType ||
      !formData.goal
    ) {
      setSnackbarMessage("Пожалуйста, заполните все обязательные поля.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Не удалось зарегистрировать.");

      const data = await response.json();

      setSnackbarMessage("Регистрация прошла успешно! Войдите");
      goToSignIn()
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("К сожалению, не удалось зарегистрировать.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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
            Зарегистрироваться
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
            />
            <TextField
              fullWidth
              margin="normal"
              label="Пароль"
              type="password"
              variant="outlined"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <TextField
              select
              fullWidth
              margin="normal"
              label="Какой вы музыкант"
              variant="outlined"
              name="musicianType"
              value={formData.musicianType}
              onChange={handleMusicianTypeChange}
              required
            >
              {musicianTypes.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Цель как музыканта
            </Typography>
            <TextareaAutosize
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              placeholder="Опишите вашу цель в музыке"
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
            <TextField
              fullWidth
              margin="normal"
              label="Instagram"
              variant="outlined"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="@ваш_инстаграм"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Любимый музыкальный жанр"
              variant="outlined"
              name="preferredMusicGenre"
              value={formData.preferredMusicGenre}
              onChange={handleInputChange}
              placeholder="Например: Jazz, Rock, Classical"
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Signup;
