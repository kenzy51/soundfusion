import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  TextField,
  Button,
  Box,
  ThemeProvider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import { geistSans, geistMono } from "@/lib/fonts";
import theme from "@/lib/createTheme";

const Dashboard = () => {
  const router = useRouter();
  const [name, setName] = useState(null);
  const [goal, setGoal] = useState(null);
  const [users, setUsers] = useState([]); // State to store users
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/sign-in");
    } else {
      const userName:any = localStorage.getItem("name");
      const goal:any = localStorage.getItem("goal");
      setGoal(goal);
      setName(userName);
    }
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        if (response.ok) {
          setUsers(data.users); 
        } else {
          console.error("Error fetching users:", data.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); 
  }, []);

  const handleSearch = () => {
    console.log("Searching for musician:", searchTerm);
  };

  if (!name) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <Box sx={{ mb: 3, textAlign: "center" }}>
          {/* <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ width: "100%" }}
          >
            Показать всех музыкантов
          </Button> */}
        </Box>
        <h1>Привет, {name}!</h1>
        <h3>Твоя цель</h3>
        <p>{goal}</p>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Список музыкантов:
          </Typography>
          <List>
            {users.map((user:any) => (
              <ListItem key={user._id}>
                <ListItemText
                  primary={user.name}
                  secondary={`${user.musicianType} - ${user.goal}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
