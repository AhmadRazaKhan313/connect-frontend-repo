import { Alert, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState } from 'react';
import { CirclePicker } from 'react-color';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';

import { UpdatePasswordValidationSchema } from '../../../utils/ValidationSchemas';

const initialValues = {
    password: '',
    newPassword: ''
};

function UpdatePassword() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMssage] = useState('');

    const onSubmit = (values) => {
        setIsLoading(true);
        jwt.updatePassword(values)
            .then((res) => {
                setIsLoading(false);
                alert('Password Updated Successfully');
                handleLogout();
            })
            .catch((err) => {
                setIsLoading(false);
                setIsError(true);
                setErrorMssage(err?.response?.data?.message);
            });
    };

    const handleLogout = () => {
        jwt.setIsLogin(false);
        jwt.removeToken();
        jwt.removeRefreshtoken();
        jwt.removeUser();
        navigate(0);
    };

    return (
        <>
            <h3>Update Password</h3>
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={UpdatePasswordValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel> Current Password </InputLabel>
                            <OutlinedInput
                                id="password"
                                name="password"
                                type="password"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Current Password"
                                inputProps={{}}
                            />
                            {errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel> New Password </InputLabel>
                            <OutlinedInput
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={values.newPassword}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="New Password"
                                inputProps={{}}
                            />
                            {errors.newPassword && (
                                <FormHelperText error id="standard-weight-helper-text-newPassword">
                                    {errors.newPassword}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid || isLoading} title="Update Password" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default UpdatePassword;
