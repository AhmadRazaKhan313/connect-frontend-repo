import {
    Alert, FormControl, FormControlLabel, FormHelperText, Grid,
    InputLabel, OutlinedInput, Typography, Box, Divider, Checkbox,
    Select, MenuItem
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useTheme } from '@mui/material/styles';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { AddStaffValidationSchema } from '../../utils/ValidationSchemas';

function AddStaff() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(true);

    useEffect(() => {
        jwt.getCustomRoles()
            .then((res) => setRoles(res?.data || []))
            .catch(() => setRoles([]))
            .finally(() => setRolesLoading(false));
    }, []);

    const initialValues = {
        fullname: '', email: '', password: '', cnic: '', mobile: '', address: '',
        roleId: '', isPartner: false, share: 0, sendWelcomeMessage: true
    };

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        const payload = {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            cnic: values.cnic,
            mobile: values.mobile,
            address: values.address,
            roleId: values.roleId,
            isPartner: values.isPartner,
            share: values.isPartner ? Number(values.share || 0) : 0,
            sendWelcomeMessage: values.sendWelcomeMessage
        };

        jwt.addStaff(payload)
            .then(() => {
                setIsLoading(false);
                alert('Staff added successfully!');
                resetForm();
                navigate('/dashboard/all-staff');
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message || 'Something went wrong');
                setIsError(true);
                setIsLoading(false);
            });
    };

    return (
        <>
            <h3>Add Staff Member</h3>

            <Alert severity="info" icon={<AssignmentIndIcon />} sx={{ mb: 2 }}>
                Every account must be assigned a <strong>role</strong>. The account inherits that role's permissions.
                Manage roles under <strong>Roles &rarr; Add Role</strong>.
            </Alert>

            {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            {!rolesLoading && roles.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No roles exist yet. Please create a role first (Roles &rarr; Add Role) before adding staff.
                </Alert>
            )}

            <Formik initialValues={initialValues} validationSchema={AddStaffValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, isValid, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Full Name *</InputLabel>
                                    <OutlinedInput name="fullname" type="text" value={values.fullname}
                                        onBlur={handleBlur} onChange={handleChange} label="Full Name *" />
                                    {touched.fullname && errors.fullname && <FormHelperText error>{errors.fullname}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Email *</InputLabel>
                                    <OutlinedInput name="email" type="text" value={values.email}
                                        onBlur={handleBlur} onChange={handleChange} label="Email *" />
                                    {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Password *</InputLabel>
                                    <OutlinedInput name="password" type="password" value={values.password}
                                        onBlur={handleBlur} onChange={handleChange} label="Password *" />
                                    {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>CNIC *</InputLabel>
                                    <OutlinedInput name="cnic" type="text" value={values.cnic}
                                        onBlur={handleBlur} onChange={handleChange} label="CNIC *" />
                                    {touched.cnic && errors.cnic && <FormHelperText error>{errors.cnic}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Mobile *</InputLabel>
                                    <OutlinedInput name="mobile" type="text" value={values.mobile}
                                        onBlur={handleBlur} onChange={handleChange} label="Mobile *" />
                                    {touched.mobile && errors.mobile && <FormHelperText error>{errors.mobile}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Address *</InputLabel>
                                    <OutlinedInput name="address" type="text" value={values.address}
                                        onBlur={handleBlur} onChange={handleChange} label="Address *" />
                                    {touched.address && errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            {/* Role (required) */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={touched.roleId && Boolean(errors.roleId)}>
                                    <InputLabel id="role-label">Role *</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        name="roleId"
                                        value={values.roleId}
                                        label="Role *"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    >
                                        {roles.map((r) => (
                                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.roleId && errors.roleId && <FormHelperText error>{errors.roleId}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Partner (financial only) */}
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Profit Sharing</Typography>
                        <Box sx={{ mb: 1 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values.isPartner}
                                        onChange={(e) => {
                                            setFieldValue('isPartner', e.target.checked);
                                            if (!e.target.checked) setFieldValue('share', 0);
                                        }}
                                    />
                                }
                                label="This account is a financial Partner (profit sharing)"
                            />
                        </Box>
                        {values.isPartner && (
                            <Grid container spacing={2} sx={{ mb: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>Profit Share % *</InputLabel>
                                        <OutlinedInput name="share" type="number" value={values.share}
                                            onBlur={handleBlur} onChange={handleChange}
                                            label="Profit Share % *" inputProps={{ min: 0, max: 100 }} />
                                        {touched.share && errors.share && <FormHelperText error>{errors.share}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}

                        <Box sx={{ mt: 1, mb: 1 }}>
                            <label htmlFor="sendWelcomeMessage" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <Field id="sendWelcomeMessage" name="sendWelcomeMessage" type="checkbox" checked={values.sendWelcomeMessage} />
                                <Typography variant="body2">Send welcome message via SMS</Typography>
                            </label>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '200px' }}>
                                <SimpleButton isValid={!isValid || isLoading || roles.length === 0} title="Add Staff" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default AddStaff;
