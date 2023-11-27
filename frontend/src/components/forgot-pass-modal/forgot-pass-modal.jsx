import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormHelperText,
} from '@mui/material';
import { hasEmailError } from '../../utils/Email';
import FormTextField from '../Form/FormTextField';

const ForgotPassModal = ({ visibility, onVisibilityChange }) => {
  const [email, setEmail] = useState('');
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');

  const onSubmit = () => {
    if (hasEmailError(email)) {
      setIsEmailWrong(true);
      setEmailHelperText('Your email is not valid');
      return;
    }
    // TODO: api call
    // TODO: if an error ocurred, set the helper text to an error msg
    // close the modal if it was successful
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
        <FormHelperText sx={{ color: 'var(--error-color)' }}>{emailHelperText}</FormHelperText>
        <FormTextField
          type="text"
          label="Email"
          value={email}
          error={isEmailWrong}
          onChange={(event) => {
            setEmail(event.target.value);
            setIsEmailWrong(false);
            setEmailHelperText('');
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
