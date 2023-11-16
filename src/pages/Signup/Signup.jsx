import React, { useState } from 'react';
import { FormControl, Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import ForgotPassModal from '../../components/forgot-pass-modal/forgot-pass-modal';
import FormTextField from '../../components/Form/FormTextField';
import { hasEmailError } from '../../utils/Email';
import '../../css/Signup.css';

const SignUpForm = ({ onLoginClick }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secondPass, setSecondPass] = useState('');
  const [isSecondPassWrong, setIsSecondPassWrong] = useState(false);

  // TODO: add form validation
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (hasEmailError(email)) {
      return;
    }
    if (password !== secondPass) {
      setIsSecondPassWrong(true);
      return;
    }
    // TODO: add API call for sign up
    console.log('submit');
  };

  return (
    <Stack justifyContent="center" alignItems="center" className="form-container">
      <Stack
        justifyContent="center"
        alignItems="center"
        gap={2}
        p={8}
        style={{ backgroundColor: 'var(--background-color)', borderRadius: 20, width: '50%' }}
      >
        <Typography variant="h2" fontSize={45} style={{ textAlign: 'center' }}>
          Sign Up
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <FormControl>
            <FormTextField
              type="text"
              label="Full Name"
              value={fullname}
              onChange={(event) => {
                setFullname(event.target.value);
              }}
            />
            <FormTextField
              type="text"
              label="Email"
              value={email}
              error={hasEmailError(email)}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <FormTextField
              type="tel"
              label="Phone Number"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
              }}
            />
            <FormTextField
              type="password"
              label="Enter Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <FormTextField
              type="password"
              label="Confirm Password"
              value={secondPass}
              error={isSecondPassWrong}
              onChange={(event) => {
                setSecondPass(event.target.value);
              }}
            />
            <Stack gap={2}>
              <Button color="primary" variant="contained" type="submit">
                SignUp
              </Button>
              <Button color="primary" variant="outlined" onClick={onLoginClick}>
                Login
              </Button>
            </Stack>
          </FormControl>
        </form>
      </Stack>
    </Stack>
  );
};

const LoginForm = ({ onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [forgotPassModalVisibility, setForgotPassModalVisibility] = useState(false);

  // TODO: add form validation
  const handleFormSubmit = (e) => {
    if (hasEmailError(email)) {
      return;
    }
    e.preventDefault();
    // TODO: add API call for login
  };

  const handleClickOnForgotPass = () => {
    setForgotPassModalVisibility(true);
  };

  return (
    <Stack justifyContent="center" alignItems="center" className="form-container">
      <ForgotPassModal
        visibility={forgotPassModalVisibility}
        onVisibilityChange={() => setForgotPassModalVisibility(false)}
      />
      <Stack
        justifyContent="center"
        alignItems="center"
        gap={2}
        p={8}
        style={{ backgroundColor: 'var(--background-color)', borderRadius: 20, width: '60%' }}
      >
        <Typography variant="h2" fontSize={45} style={{ textAlign: 'center' }}>
          Login
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <FormControl>
            <FormTextField
              type="text"
              label="Email"
              value={email}
              error={hasEmailError(email)}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <FormTextField
              type="password"
              label="Enter Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <FormControlLabel
              control={<Checkbox sx={{ color: 'var(--light-text-color-lighter)' }} />}
              value={keepMeLoggedIn}
              onChange={() => setKeepMeLoggedIn((prev) => !prev)}
              label="Keep me logged in"
            />
            <Stack gap={2}>
              <Button color="primary" variant="contained" type="submit">
                Login
              </Button>
              <Button color="warning" variant="outlined" onClick={handleClickOnForgotPass}>
                Forgot Password
              </Button>
              <Button color="primary" variant="outlined" onClick={onSignUpClick}>
                SignUp
              </Button>
            </Stack>
          </FormControl>
        </form>
      </Stack>
    </Stack>
  );
};

const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleChangeToLoginForm = () => {
    setIsSignUp(false);
  };

  const handleChangeToSignupForm = () => {
    setIsSignUp(true);
  };

  return isSignUp ? (
    <SignUpForm onLoginClick={handleChangeToLoginForm} />
  ) : (
    <LoginForm onSignUpClick={handleChangeToSignupForm} />
  );
};

export default SignUp;
