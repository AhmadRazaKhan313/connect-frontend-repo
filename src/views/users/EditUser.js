import { Alert, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState } from 'react';
import SimpleButton from 'ui-component/SimpleButton';

import { AddUserValidationSchema } from '../../utils/ValidationSchemas';
import { useLocation, useNavigate } from 'react-router';

function EditUser() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useLocation().state;
    const { id, userId, fullname, email, cnic, mobile, address } = user;

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const initialValues = {
        fullname,
        email,
        userId,
        cnic,
        mobile,
        address,
        sendWelcomeMessage: false
    };

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        jwt.editUser(id, values)
            .then((res) => {
                setIsLoading(false);
                alert('User Edited');
                navigate('/dashboard/all-users');
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    return (
        <>
            <h3>Edit User Details</h3>
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={AddUserValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Full Name </InputLabel>
                                    <OutlinedInput
                                        id="fullname"
                                        name="fullname"
                                        type="text"
                                        value={values.fullname}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Full Name"
                                    />
                                    {errors.fullname && (
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {errors.fullname}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Email </InputLabel>
                                    <OutlinedInput
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={values.email}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Email"
                                    />
                                    {errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> User Id </InputLabel>
                                    <OutlinedInput
                                        id="userId"
                                        name="userId"
                                        type="text"
                                        value={values.userId}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="User Id"
                                    />
                                    {errors.userId && (
                                        <FormHelperText error id="standard-weight-helper-text-bandwidth">
                                            {errors.userId}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> CNIC </InputLabel>
                                    <OutlinedInput
                                        id="cnic"
                                        name="cnic"
                                        type="text"
                                        value={values.cnic}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="User Id"
                                    />
                                    {errors.cnic && (
                                        <FormHelperText error id="standard-weight-helper-text-bandwidth">
                                            {errors.cnic}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Mobile </InputLabel>
                                    <OutlinedInput
                                        id="mobile"
                                        name="mobile"
                                        type="text"
                                        value={values.mobile}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="User Id"
                                    />
                                    {errors.mobile && (
                                        <FormHelperText error id="standard-weight-helper-text-bandwidth">
                                            {errors.mobile}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Address </InputLabel>
                                    <OutlinedInput
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={values.address}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="address"
                                    />
                                    {errors.address && (
                                        <FormHelperText error id="standard-weight-helper-text-purchase-rate">
                                            {errors.address}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <label htmlFor="sendWelcomeMessage">
                            <Field id="sendWelcomeMessage" name="sendWelcomeMessage" type="checkbox" checked={values.sendWelcomeMessage} />
                            Send Welcome Message
                        </label>
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid || isLoading} title="Edit User" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default EditUser;
