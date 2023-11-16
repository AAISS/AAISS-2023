import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { hasEmailError } from '../../utils/Email';
import FormTextField from '../Form/FormTextField';

const ForgotPassModal = ({ visibility, onVisibilityChange }) => {
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    if (hasEmailError(email)) {
      return;
    }
    // TODO: api call
    // finally, close the modal
    onVisibilityChange();
  };

  return (
    <Dialog
      onClose={onVisibilityChange}
      open={visibility}
      PaperProps={{
        style: {
          backgroundColor: 'var(--background-color)',
          color: 'white',
        },
      }}
    >
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <DialogContentText pb={2} sx={{ color: 'var(--light-text-color-lighter)' }}>
          Enter your email here in order to get the verification code.
        </DialogContentText>
        <FormTextField
          type="text"
          label="Email"
          value={email}
          error={hasEmailError(email)}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onVisibilityChange}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassModal;
