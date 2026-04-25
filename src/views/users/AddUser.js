import { Alert, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState, useEffect } from 'react';
import SimpleButton from 'ui-component/SimpleButton';
import { AddUserValidationSchema } from '../../utils/ValidationSchemas';

function AddUser() {
    const theme = useTheme();
    const isPlatformSuperAdmin = jwt.getUser()?.role === 'platformSuperAdmin';

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState('');
    const [orgError, setOrgError] = useState('');

    useEffect(() => {
        if (isPlatformSuperAdmin) {
            jwt.getAllOrganizations()
                .then((res) => setOrganizations(res?.data || []))
                .catch((err) => console.log(err));
        }
    }, []);

    const onSubmit = (values, { resetForm }) => {
        //Org required for platformSuperAdmin 
        if (isPlatformSuperAdmin && !selectedOrg) {
            setOrgError('Select Organization');
            return;
        }

        setIsLoading(true);
        setOrgError('');

        const payload = {
            ...values,
            ...(isPlatformSuperAdmin && { organizationId: selectedOrg })
        };

        jwt.createUser(payload)
            .then((res) => {
                setIsLoading(false);
                alert('User Added');
                resetForm();
                setSelectedOrg('');
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const initialValues = {
        fullname: '',
        email: '',
        userId: '',
        cnic: '',
        mobile: '',
        address: '',
        sendWelcomeMessage: true
    };

    return (
        <>
            <h3>Add User Details</h3>
            {isError && <Alert severity="error">{errorMessage}</Alert>}

            <Formik initialValues={initialValues} validationSchema={AddUserValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>

                        {/* Organization Dropdown — only on platformSuperAdmin */}
                        {isPlatformSuperAdmin && (
                            <Grid container spacing={2} sx={{ mb: 1 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }} error={!!orgError}>
                                        <InputLabel>Select Organization *</InputLabel>
                                        <Select
                                            value={selectedOrg}
                                            onChange={(e) => {
                                                setSelectedOrg(e.target.value);
                                                setOrgError('');
                                            }}
                                            label="Select Organization *"
                                        >
                                            {organizations.map((org) => (
                                                <MenuItem key={org.id} value={org.id}>
                                                    {org.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {orgError && (
                                            <FormHelperText error>{orgError}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}

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
                                        <FormHelperText error>{errors.fullname}</FormHelperText>
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
                                        <FormHelperText error>{errors.email}</FormHelperText>
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
                                        <FormHelperText error>{errors.userId}</FormHelperText>
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
                                    />
                                    {errors.cnic && (
                                        <FormHelperText error>{errors.cnic}</FormHelperText>
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
                                    />
                                    {errors.mobile && (
                                        <FormHelperText error>{errors.mobile}</FormHelperText>
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
                                    />
                                    {errors.address && (
                                        <FormHelperText error>{errors.address}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <label htmlFor="sendWelcomeMessage">
                            <Field
                                id="sendWelcomeMessage"
                                name="sendWelcomeMessage"
                                type="checkbox"
                                checked={values.sendWelcomeMessage}
                            />
                            Send Welcome Message
                        </label>

                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid || isLoading} title="Add User" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default AddUser;