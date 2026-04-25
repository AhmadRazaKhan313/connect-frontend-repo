import { Alert, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState } from 'react';
import SimpleButton from 'ui-component/SimpleButton';
import User1 from '../../../assets/images/users/user-round.svg';

import { UpdateProfileValidationSchema } from '../../../utils/ValidationSchemas';

function UpdateProfile() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMssage] = useState('');
    const [user, setUser] = useState(jwt.getUser());

    const initialValues = {
        fullname: user?.fullname,
        cnic: user?.cnic,
        mobile: user?.mobile,
        address: user?.address,
        profileImage: null
    };

    const onSubmit = (values) => {
        setIsLoading(true);
        const formData = new FormData();
        for (const [key, value] of Object.entries(values)) {
            formData.append(key, value);
        }
        jwt.updateProfile(formData)
            .then((res) => {
                setIsLoading(false);
                alert('Profile Updated Successfully');
                jwt.setUser({ ...res?.data, time: Date.now() });
                setUser(res?.data);
            })
            .catch((err) => {
                setIsLoading(false);
                setIsError(true);
                setErrorMssage(err?.response?.data?.message);
            });
    };

    const imageUrlWithQuery = user?.profileImage + `?timestamp=${Date.now()}`;

    return (
        <>
            <h3>Update Profile</h3>
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            {isLoading && <Alert severity="success">Updating, please wait...!</Alert>}
            <img
                alt="DP"
                src={user?.profileImage ? imageUrlWithQuery : User1}
                style={{ borderRadius: '50%', width: '100px', height: '100px', marginBottom: '20px' }}
            />
            <Formik initialValues={initialValues} validationSchema={UpdateProfileValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit} enctype="multipart/form-data">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    onChange={(event) => {
                                        setFieldValue('profileImage', event.currentTarget.files[0]);
                                    }}
                                />
                            </Grid>
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
                                        inputProps={{}}
                                    />
                                    {errors.fullname && (
                                        <FormHelperText error id="standard-weight-helper-fullname">
                                            {errors.fullname}
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
                                        label="CNIC"
                                        inputProps={{}}
                                    />
                                    {errors.cnic && (
                                        <FormHelperText error id="standard-weight-helper-text-cnic">
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
                                        label="Mobile"
                                        inputProps={{}}
                                    />
                                    {errors.mobile && (
                                        <FormHelperText error id="standard-weight-helper-text-mobile">
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
                                        label="Address"
                                        inputProps={{}}
                                    />
                                    {errors.address && (
                                        <FormHelperText error id="standard-weight-helper-text-address">
                                            {errors.address}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel> Email </InputLabel>
                            <OutlinedInput
                                id="email"
                                name="email"
                                type="email"
                                value={user?.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email"
                                inputProps={{}}
                                sx={{ marginTop: '2px' }}
                                disabled
                            />
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid || isLoading} title="Update Profile" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default UpdateProfile;
