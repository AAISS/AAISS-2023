import * as React from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
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
import Toolbar from '@mui/material/Toolbar';
import AAISS from '../../assets/AAISS.png';
import { useConfig } from '../../providers/config-provider/ConfigProvider.jsx';
import Image from '../image/Image.jsx';
import useNavItem from './useNavItem.js';

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
  const { ROUTES, currentRoute, setCurrentRoute } = useConfig();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { getVariant } = useNavItem();

  const appBarPaths = Object.keys(ROUTES).filter((route) => !ROUTES[route]?.hideFromAppBar);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Link to={ROUTES.home.path} className="logo-item" onClick={() => setCurrentRoute(ROUTES.home)}>
        <NavBarImage />
      </Link>
      <Divider style={{ backgroundColor: 'var(--dark-text-color)' }} />
      <List>
        {appBarPaths.map((name, index) => (
          <Link to={ROUTES[name].path} style={{ color: 'white', textDecoration: 'none' }} key={index}>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }} className="nav">
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
          <Link to={ROUTES.home.path} className="logo-item" onClick={() => setCurrentRoute(ROUTES.home)}>
            <NavBarImage />
          </Link>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {appBarPaths.map((name, index) => (
              <Link to={ROUTES[name].path} key={index}>
                <Button
                  variant={getVariant(ROUTES[name].path, currentRoute.path)}
                  onClick={() => setCurrentRoute(ROUTES[name])}
                  sx={{
                    color: '#fff',
                    paddingRight: 2,
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
              background: 'var(--background-color-lighter-20)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
