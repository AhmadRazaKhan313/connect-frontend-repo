import { Alert, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { STAFF_TYPES } from 'utils/Constants';
import { AddStaffValidationSchema } from '../../utils/ValidationSchemas';

function AddStaff() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [roles, setRoles] = useState([]);

    // Load available roles
    useEffect(() => {
        jwt.getAllRoles()
            .then((res) => setRoles(res?.data || []))
            .catch(() => {});
    }, []);

    const initialValues = {
        fullname: '',
        email: '',
        password: '',
        cnic: '',
        mobile: '',
        address: '',
        type: '',
        share: 0,
        roleId: '',
        sendWelcomeMessage: true
    };

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        // Remove empty roleId
        const payload = { ...values };
        if (!payload.roleId) delete payload.roleId;

        jwt.addStaff(payload)
            .then((res) => {
                setIsLoading(false);
                alert('Staff Added');
                resetForm();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const handleStaffChange = (event, setFieldValue) => {
        setFieldValue('type', event.target.value);
        event.target.value === STAFF_TYPES.staff && setFieldValue('share', 0);
    };

    return (
        <>
            <h3>Add Staff Details</h3>
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={AddStaffValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Full Name</InputLabel>
                                    <OutlinedInput
                                        name="fullname"
                                        type="text"
                                        value={values.fullname}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Full Name"
                                    />
                                    {errors.fullname && <FormHelperText error>{errors.fullname}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Email</InputLabel>
                                    <OutlinedInput
                                        name="email"
                                        type="text"
                                        value={values.email}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Email"
                                    />
                                    {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Password</InputLabel>
                                    <OutlinedInput
                                        name="password"
                                        type="password"
                                        value={values.password}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Password"
                                    />
                                    {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>CNIC</InputLabel>
                                    <OutlinedInput
                                        name="cnic"
                                        type="text"
                                        value={values.cnic}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="CNIC"
                                    />
                                    {errors.cnic && <FormHelperText error>{errors.cnic}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Mobile</InputLabel>
                                    <OutlinedInput
                                        name="mobile"
                                        type="text"
                                        value={values.mobile}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Mobile"
                                    />
                                    {errors.mobile && <FormHelperText error>{errors.mobile}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Address</InputLabel>
                                    <OutlinedInput
                                        name="address"
                                        type="text"
                                        value={values.address}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Address"
                                    />
                                    {errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Select Staff Type</InputLabel>
                                    <Select
                                        name="type"
                                        value={values.type}
                                        onBlur={handleBlur}
                                        onChange={(event) => handleStaffChange(event, setFieldValue)}
                                        label="Staff Type"
                                        sx={{ paddingTop: '10px' }}
                                    >
                                        <MenuItem value="partner">Partner</MenuItem>
                                        <MenuItem value="staff">Staff</MenuItem>
                                    </Select>
                                    {errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Share</InputLabel>
                                    <OutlinedInput
                                        name="share"
                                        type="number"
                                        value={values.share}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Share"
                                        disabled={values.type === STAFF_TYPES.staff}
                                    />
                                    {errors.share && <FormHelperText error>{errors.share}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Role Dropdown */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Assign Role (Optional)</InputLabel>
                                    <Select
                                        name="roleId"
                                        value={values.roleId}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Assign Role (Optional)"
                                        sx={{ paddingTop: '10px' }}
                                    >
                                        <MenuItem value="">-- No Role --</MenuItem>
                                        {roles.map((role) => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <label htmlFor="sendWelcomeMessage">
                            <Field id="sendWelcomeMessage" name="sendWelcomeMessage" type="checkbox" checked={values.sendWelcomeMessage} />
                            Send Welcome Message
                        </label>

                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid} title="Add Staff" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default AddStaff;