import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import PropTypes from 'prop-types';
import ROUTES from '../../providers/config-provider/ROUTES';

const LogoutModal = ({ visibility, onVisibilityChange }) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    onVisibilityChange();

    window.location.reload();
    window.location.replace(ROUTES.signup.path);
  };

  return (
    <Dialog
      onClose={onVisibilityChange}
      open={visibility}
      PaperProps={{
        style: {
          backgroundColor: 'var(--background-color-lighter-20)',
        },
      }}
    >
      <DialogTitle variant="h5">Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to logout?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onVisibilityChange}>Cancel</Button>
        <Button onClick={handleLogout} color="error" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LogoutModal.propTypes = {
  visibility: PropTypes.bool,
  onVisibilityChange: PropTypes.func,
};

export default LogoutModal;
