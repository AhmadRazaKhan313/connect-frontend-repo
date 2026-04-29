import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Alert, Box, FormControl, FormHelperText, IconButton,
    InputAdornment, InputLabel, OutlinedInput, Stack, Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import useScriptRef from 'hooks/useScriptRef';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import jwt from 'jwtservice/jwtService';
import { useNavigate } from 'react-router';
import { THEME_COLOR_DARK } from 'utils/Constants';
import SimpleButton from 'ui-component/SimpleButton';

const FirebaseLogin = ({ setOpenModal, ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    return (
        <>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                            setIsLoading(true);

                            jwt.login(values)
                                .then((res) => {
                                    const token = res.data.tokens.access.token;
                                    const refreshToken = res.data.tokens.refresh.token;
                                    const user = res?.data?.user;
                                    const orgId = user?.organizationId;

                                    if (orgId) {
                                        axios.get(`http://localhost:4000/api/v1/organization/${orgId}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        })
                                        .then((orgRes) => {
                                            const subdomain = orgRes?.data?.subdomain;
                                            if (subdomain) {
                                                // localStorage.setItem('connect_last_subdomain', subdomain);
                                                // localStorage.setItem('connect_isLogin', 'true');
                                                

                                                const redirectUrl = `http://${subdomain}.localhost:3000/auth-redirect?token=${token}&refreshToken=${refreshToken}&user=${encodeURIComponent(JSON.stringify(user))}`;
                                                window.location.replace(redirectUrl);
                                            } else {
                                                setIsLoading(false);
                                                setIsError(true);
                                                setErrorMessage('Subdomain not found');
                                            }
                                        })
                                        .catch(() => {
                                            setIsLoading(false);
                                            setIsError(true);
                                            setErrorMessage('Organization not found');
                                        });
                                    } else {
                                        setIsLoading(false);
                                        setIsError(true);
                                        setErrorMessage('No organization assigned');
                                    }
                                })
                                .catch((err) => {
                                    setIsLoading(false);
                                    setIsError(true);
                                    setErrorMessage(err?.response?.data?.message || 'Login failed');
                                });
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isValid, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        {isError && <Alert severity="error">{errorMessage}</Alert>}
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'right',
                                    marginTop: '10px',
                                    color: THEME_COLOR_DARK
                                }}
                                onClick={() => setOpenModal(true)}
                            >
                                Forgot Password?
                            </Typography>
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <SimpleButton isValid={!isValid || isLoading} title="Sign In" />
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
