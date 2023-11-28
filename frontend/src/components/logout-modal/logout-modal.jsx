import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

const LogoutModal = ({ visibility, onVisibilityChange }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    onVisibilityChange();
    navigate('/', { replace: true });
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
        <Button onClick={onVisibilityChange} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="error">
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
