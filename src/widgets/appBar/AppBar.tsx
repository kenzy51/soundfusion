import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const pages = ["Products", "Pricing", "Blog"];

export default function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);
  const [showUsers, setShowUsers] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users`);
      const data = await response.json();
      setAllUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users`);
      const data = await response.json();
      const filteredUsers = data.users.filter((user: any) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    fetchUsers();
    setShowUsers(true);
  };
  const hideUsers = () => {
    setShowUsers(false);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LibraryMusicIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SoundFusion
          </Typography>

          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <Autocomplete
              freeSolo
              options={users}
              getOptionLabel={(option: any) =>
                `${option.name} (${option.instagram || "No Instagram"})`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Найти пользователей"
                  variant="outlined"
                  onChange={handleSearchChange}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option: any) => (
                <MenuItem {...props} key={option._id}>
                  <Avatar sx={{ mr: 2 }}>{option.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {option.instagram || "No Instagram"}
                    </Typography>
                  </Box>
                </MenuItem>
              )}
            />
          </Box>

          <Button
            variant="contained"
            onClick={!showUsers ? handleShowAll : hideUsers}
          >
            {!showUsers ? "Показать всех музыкантов" : "Cкрыть"}
          </Button>
        </Toolbar>

        {showUsers && (
          <Box sx={{ mt: 2 }}>
            {allUsers.map((user: any) => (
              <Card sx={{ mb: 2 }} key={user._id}>
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Instagram: {user.instagram || "Нет Instagram"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </AppBar>
  );
}
