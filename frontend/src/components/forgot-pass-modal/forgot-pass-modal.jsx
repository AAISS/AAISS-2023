import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { useAPI } from '../../providers/APIProvider/APIProvider.jsx';
import { hasEmailError } from '../../utils/Email';
import FormTextField from '../Form/FormTextField';


const ForgotPassModal = ({ visibility, onVisibilityChange }) => {
  const { forgotPassword } = useAPI();

  const [email, setEmail] = useState('');
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async () => {
    if (hasEmailError(email)) {
      setIsEmailWrong(true);
      setEmailHelperText('Your email is not valid');
      return;
    }

    setIsLoading(true);
    setIsEmailWrong(false);
    setEmailHelperText('');

    const { response, error } = await forgotPassword(email);

    setIsLoading(false);

    if (response && response.status === 200) {
      setEmailHelperText("Success: If the email is registered, you will receive a new password shortly. Closing...");
      setIsSuccess(true);

      setTimeout(onVisibilityChange, 3000);

    } else {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error && error.status === 400 && error.data && error.data.detail) {
          errorMessage = error.data.detail;
      }

      setIsEmailWrong(true);
      setEmailHelperText(errorMessage);
    }
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
          {isSuccess
            ? 'Success! Please check your email for the temporary password.'
            : 'Enter your email here in order to get the verification code.'
          }
        </DialogContentText>

        <FormHelperText sx={{
            color: isSuccess ? 'var(--success-color)' : 'var(--error-color)'
          }}>
            {emailHelperText}
        </FormHelperText>

        {!isSuccess && (
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
                disabled={isLoading}
            />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onVisibilityChange} disabled={isLoading}>
          Cancel
        </Button>

        {!isSuccess && (
            <Button
                onClick={onSubmit}
                variant="contained"
                disabled={isLoading || isEmailWrong || email === ''}
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
                Submit
            </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassModal;