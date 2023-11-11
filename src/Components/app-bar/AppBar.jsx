import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "../image/Image.jsx";
import AAISS from "../../assets/AAISS.png";
import { useConfig } from "../../providers/config-provider/ConfigProvider.jsx";
import useNavItem from "../nav/nav-item/useNavItem.js";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const NavBarImage = () => (
  <Image
    src={AAISS}
    alt={"aaiss logo"}
    style={{
      width: "10%",
      height: "inherit",
      padding: 10,
    }}
  />
);

export default function DrawerAppBar() {
  const { ROUTES, currentRoute, setCurrentRoute } = useConfig();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { getVariant } = useNavItem();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <NavBarImage />
      <Divider />
      <List>
        {Object.keys(ROUTES).map((name, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }} className="nav">
      <AppBar component="nav" className="backdrop-color">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <NavBarImage />
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {Object.keys(ROUTES).map((name, index) => (
              <Link to={ROUTES[name].path}>
                <Button
                  key={index}
                  variant={getVariant(ROUTES[name].path, currentRoute.path)}
                  onClick={() => setCurrentRoute(ROUTES[name])}
                  sx={{
                    color: "#fff",
                  }}
                >
                  {name}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav className="nav">
        <Drawer
          //   container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
