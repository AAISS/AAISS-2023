import React, { useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import AAISS from '../../assets/AAISS.png';
import { useConfig } from '../../providers/config-provider/ConfigProvider.jsx';
import Image from '../image/Image.jsx';
import LogoutModal from '../logout-modal/logout-modal.jsx';

const drawerWidth = 240;

const NavBarImage = () => (
  <Image
    src={AAISS}
    alt={'aaiss logo'}
    style={{
      width: '100px',
      height: 'inherit',
      paddingRight: 24,
    }}
  />
);

export default function DrawerAppBar() {
  const { ROUTES, accessToken, refreshToken } = useConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalVisibility, setLogoutModalVisibility] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    handleClose();
    setLogoutModalVisibility(true);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const appBarPaths = Object.keys(ROUTES).filter((route) => !ROUTES[route]?.hideFromAppBar);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const shouldShowRoute = (route) => {
    if (route.title === 'Signup') {
      if (accessToken || refreshToken) {
        return false;
      }
      return true;
    }

    return true;
  };

  const isLoggedIn = Boolean(accessToken);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Link href={ROUTES.home.path} className="logo-item">
        <NavBarImage />
      </Link>
      <Divider />
      <List>
        {appBarPaths.map((name, index) => {
          return (
            shouldShowRoute(ROUTES[name]) && (
              <Link href={ROUTES[name].path} style={{ color: 'white', textDecoration: 'none' }} key={index}>
                <ListItem disablePadding>
                  <ListItemButton sx={{ textAlign: 'center' }}>
                    <ListItemText primary={name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            )
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }} className="nav">
      <LogoutModal visibility={logoutModalVisibility} onVisibilityChange={() => setLogoutModalVisibility(false)} />
      <AppBar component="nav" className="backdrop-color">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link href={ROUTES.home.path} className="logo-item">
            <NavBarImage />
          </Link>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {appBarPaths.map((name, index) => {
              return (
                shouldShowRoute(ROUTES[name]) && (
                  <Button
                    key={index}
                    href={ROUTES[name].path}
                    // TODO: below lines will break the app on production :))
                    // variant={ROUTES[name].path === currentRoute.path ? 'contained' : 'text'}
                    // onClick={() => setCurrentRoute(ROUTES[name])}
                    sx={{
                      color: '#fff',
                      paddingRight: 2,
                    }}
                  >
                    {name}
                  </Button>
                )
              );
            })}
          </Box>
          {isLoggedIn && (
            <Box sx={{ marginLeft: 'auto' }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => window.location.replace(ROUTES.myAccount.path)}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'var(--background-color)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
