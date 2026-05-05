import { Alert, Box, FormControl, FormHelperText, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import * as Yup from 'yup';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api/v1';

const validationSchema = Yup.object().shape({
    name:            Yup.string().required('Name is required'),
    email:           Yup.string().email('Invalid email').required('Email is required'),
    password:        Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Please confirm password'),
});

function Setup() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [status, setStatus] = useState('checking'); // checking | open | done
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Pehle check karo — setup already ho chuka hai?
        axios.get(`${BASE_URL}/auth/setup`)
            .then((res) => {
                if (res.data.isSetupDone) {
                    setStatus('done');
                } else {
                    setStatus('open');
                }
            })
            .catch(() => setStatus('open'));
    }, []);

    const onSubmit = (values) => {
        setIsLoading(true);
        setIsError(false);
        axios.post(`${BASE_URL}/auth/setup`, {
            name:     values.name,
            email:    values.email,
            password: values.password,
        })
            .then(() => {
                setIsLoading(false);
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2500);
            })
            .catch((err) => {
                setIsLoading(false);
                setIsError(true);
                setErrorMessage(err?.response?.data?.message || 'Something went wrong');
            });
    };

    // Loading state
    if (status === 'checking') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography color="text.secondary">Checking setup status...</Typography>
            </Box>
        );
    }

    // Already setup ho chuka hai
    if (status === 'done') {
        return (
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 10, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 1 }}>Setup Complete</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Super admin already exists. This page is no longer available.
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate('/login')}
                >
                    Go to Login
                </Typography>
            </Box>
        );
    }

    // Success state
    if (success) {
        return (
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 10, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 1 }}>Super Admin Created!</Typography>
                <Typography color="text.secondary">
                    Redirecting to login page...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8, px: 2 }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Initial Setup</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create the super admin account. This page will be automatically disabled after setup.
            </Typography>

            {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Formik
                initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 1 }}>
                            <InputLabel>Full Name *</InputLabel>
                            <OutlinedInput
                                name="name" value={values.name}
                                onChange={handleChange} onBlur={handleBlur} label="Full Name *"
                            />
                            {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 1 }}>
                            <InputLabel>Email *</InputLabel>
                            <OutlinedInput
                                name="email" value={values.email}
                                onChange={handleChange} onBlur={handleBlur} label="Email *"
                            />
                            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 1 }}>
                            <InputLabel>Password *</InputLabel>
                            <OutlinedInput
                                type="password" name="password" value={values.password}
                                onChange={handleChange} onBlur={handleBlur} label="Password *"
                            />
                            {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
                            <InputLabel>Confirm Password *</InputLabel>
                            <OutlinedInput
                                type="password" name="confirmPassword" value={values.confirmPassword}
                                onChange={handleChange} onBlur={handleBlur} label="Confirm Password *"
                            />
                            {touched.confirmPassword && errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
                        </FormControl>

                        <SimpleButton isValid={isLoading} title="Create Super Admin" />
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default Setup;
