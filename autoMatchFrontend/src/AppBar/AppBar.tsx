import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
const MyAppBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#22baa0",
          color: "#fff",
          minWidth: "200px",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          Auto Matcher
        </Typography>
      </Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          color: "#4E5E6A",
          flex: 1,
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            color="inherit"
            sx={{
              ml: "auto",
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MyAppBar;
