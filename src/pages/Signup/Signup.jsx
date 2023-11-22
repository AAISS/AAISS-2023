import React, {useCallback, useEffect, useState} from 'react';
import {Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Stack, Typography} from '@mui/material';
import ForgotPassModal from '../../components/forgot-pass-modal/forgot-pass-modal';
import FormTextField from '../../components/Form/FormTextField';
import {hasEmailError} from '../../utils/Email';
import '../../css/Signup.css';
import {useAPI} from "../../providers/APIProvider/APIProvider.jsx";
import Toast from "../../Components/toast/Toast.jsx";
import {Helper} from "../../utils/Helper.js";

const validatePhone = (phone) => {
    const PHONE_LENGTH = 11;
    const phoneStr = String(phone);
    // 09102014779
    const lengthIsOk = phoneStr.length === PHONE_LENGTH;
    const startsWithZeroNine = phoneStr.startsWith('09');
    return {
        lengthIsOk,
        startsWithZeroNine,
    };
};

const SignUpForm = ({onLoginClick}) => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [secondPass, setSecondPass] = useState('');
    const [isSecondPassWrong, setIsSecondPassWrong] = useState(false);
    const [isPhoneWrong, setIsPhoneWrong] = useState(false);
    const [isEmailWrong, setIsEmailWrong] = useState(false);
    const [emailHelperText, setEmailHelperText] = useState('');
    const [phoneHelperText, setPhoneHelperText] = useState('');
    const [secondPassHelperText, setSecondPassHelperText] = useState('');
    const [openToast, setOpenToast] = useState(false)
    const [toastData, setToastData] = useState()

    const {
        createUser,
        createUserData,
    } = useAPI()

    const handleSignUp = useCallback(() => {
        const data = {}
        data.name = fullname
        data.phone_number = phoneNumber
        data.account = {
            password: password,
            email: email
        }
        createUser(data)
    }, [createUser, email, fullname, password, phoneNumber])

    // TODO: add form validation
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (hasEmailError(email)) {
            setIsEmailWrong(true);
            setEmailHelperText('Your email is not valid');
            return;
        }
        const {lengthIsOk, startsWithZeroNine} = validatePhone(phoneNumber);
        if (!lengthIsOk) {
            setIsPhoneWrong(true);
            setPhoneHelperText('Phone number is two short');
            return;
        }
        if (!startsWithZeroNine) {
            setIsPhoneWrong(true);
            setPhoneHelperText('Phone number should start with 09');
            return;
        }
        if (password !== secondPass) {
            setIsSecondPassWrong(true);
            setSecondPassHelperText('Passwords are not the same');
            return;
        }
        // TODO: add API call for sign up
        // TODO: route to my-account page
        console.log('submit');
    };

    useEffect(() => {
        if (createUserData == null) return

        setToastData(Helper.getToastDataFromResponse())
        setOpenToast(true)
    }, [createUserData])

    return (
        <Stack justifyContent="center" alignItems="center" className="form-container">
            <Stack
                justifyContent="center"
                alignItems="center"
                gap={2}
                p={8}
                style={{backgroundColor: 'var(--background-color)', borderRadius: 20, width: '50%'}}
            >
                <Typography variant="h2" fontSize={45} style={{textAlign: 'center'}}>
                    Sign Up
                </Typography>
                <form onSubmit={handleFormSubmit}>
                    <FormControl>
                        <Toast
                            open={openToast}
                            setOpen={setOpenToast}
                            alertType={toastData?.alertType}
                            message={toastData?.message}
                        />
                        <FormTextField
                            type="text"
                            label="Full Name"
                            value={fullname}
                            onChange={(event) => {
                                setFullname(event.target.value);
                            }}
                        />
                        <FormHelperText sx={{color: 'var(--error-color)'}}>{emailHelperText}</FormHelperText>
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
                        <FormHelperText sx={{color: 'var(--error-color)'}}>{phoneHelperText}</FormHelperText>
                        <FormTextField
                            type="tel"
                            label="Phone Number"
                            value={phoneNumber}
                            error={isPhoneWrong}
                            onChange={(event) => {
                                setPhoneNumber(event.target.value);
                                setIsPhoneWrong(false);
                                setPhoneHelperText('');
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
                        <FormHelperText sx={{color: 'var(--error-color)'}}>{secondPassHelperText}</FormHelperText>
                        <FormTextField
                            type="password"
                            label="Confirm Password"
                            value={secondPass}
                            error={isSecondPassWrong}
                            onChange={(event) => {
                                setSecondPass(event.target.value);
                                setIsSecondPassWrong(false);
                                setSecondPassHelperText('');
                            }}
                        />
                        <Stack gap={2}>
                            <Button onClick={handleSignUp} color="primary" variant="contained" type="submit">
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

const LoginForm = ({onSignUpClick}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
    const [forgotPassModalVisibility, setForgotPassModalVisibility] = useState(false);
    const [isEmailWrong, setIsEmailWrong] = useState(false);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);
    const [emailHelperText, setEmailHelperText] = useState('');
    const [passwordHelperText, setPasswordHelperText] = useState('');
    const [openToast, setOpenToast] = useState(false)
    const [toastData, setToastData] = useState()

    const handleFormSubmit = (e) => {
        if (hasEmailError(email)) {
            setIsEmailWrong(true);
            setEmailHelperText('Your email is not valid');
            return;
        }
        e.preventDefault();
        // TODO: add API call for login
        // TODO: setIsPasswordWrong(true) if pass is wrong
        // TODO: setPasswordHelperText('Wrong password')
        // TODO: route to my-account page if it's successful
    };

    const {
        issueToken,
        issueTokenResponse,
    } = useAPI()

    useEffect(() => {
        if (issueTokenResponse == null) return

        setToastData(Helper.getToastDataFromResponse(issueTokenResponse))
        setOpenToast(true)

        localStorage["user"] = JSON.stringify(issueTokenResponse.data)
    }, [issueTokenResponse])

    const handleClickOnForgotPass = () => {
        setForgotPassModalVisibility(true);
    };

    const handleLogin = useCallback(() => {
        const data = {
            password: password,
            email: email
        }

        issueToken(data)
    }, [email, issueToken, password])

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
                style={{backgroundColor: 'var(--background-color)', borderRadius: 20, width: '60%'}}
            >
                <Typography variant="h2" fontSize={45} style={{textAlign: 'center'}}>
                    Login
                </Typography>
                <form onSubmit={handleFormSubmit}>
                    <FormControl>
                        <Toast
                            open={openToast}
                            setOpen={setOpenToast}
                            alertType={toastData?.alertType}
                            message={toastData?.message}
                        />
                        <FormHelperText sx={{color: 'var(--error-color)'}}>{emailHelperText}</FormHelperText>
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
                        <FormHelperText sx={{color: 'var(--error-color)'}}>{passwordHelperText}</FormHelperText>
                        <FormTextField
                            type="password"
                            label="Enter Password"
                            value={password}
                            error={isPasswordWrong}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setIsPasswordWrong(false);
                                setPasswordHelperText('');
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox sx={{color: 'var(--light-text-color-lighter)'}}/>}
                            value={keepMeLoggedIn}
                            onChange={() => setKeepMeLoggedIn((prev) => !prev)}
                            label="Keep me logged in"
                        />
                        <Stack gap={2}>
                            <Button onClick={handleLogin} color="primary" variant="contained" type="submit">
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
        <SignUpForm onLoginClick={handleChangeToLoginForm}/>
    ) : (
        <LoginForm onSignUpClick={handleChangeToSignupForm}/>
    );
};

export default SignUp;
