import {
    Alert, Box, Checkbox, FormControl, FormControlLabel,
    FormHelperText, Grid, InputLabel, OutlinedInput, Paper,
    Popover, Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { HexColorPicker } from 'react-colorful';
import * as Yup from 'yup';

const FEATURE_LABELS = {
    smsAlerts:       'SMS Alerts',
    invoicing:       'Invoicing',
    expenses:        'Expenses',
    extraIncome:     'Extra Income',
    staffManagement: 'Staff Management',
    ispManagement:   'ISP Management',
    dashboard:       'Dashboard',
};

const ColorPickerField = ({ label, value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    return (
        <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        width: 44, height: 44, borderRadius: 2,
                        backgroundColor: value, border: '2px solid #e0e0e0',
                        cursor: 'pointer', transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                />
                <OutlinedInput
                    size="small" value={value}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ width: 130, fontFamily: 'monospace' }}
                    inputProps={{ maxLength: 7 }}
                />
            </Box>
            <Popover open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Paper sx={{ p: 2 }}>
                    <HexColorPicker color={value} onChange={onChange} />
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, fontFamily: 'monospace' }}>
                        {value}
                    </Typography>
                </Paper>
            </Popover>
        </Box>
    );
};

const validationSchema = Yup.object().shape({
    name:      Yup.string().required('Organization name is required'),
    email:     Yup.string().email('Invalid email').required('Email is required'),
    subdomain: Yup.string()
        .matches(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphen only')
        .required('Subdomain is required'),
    adminUser: Yup.object().shape({
        name:     Yup.string().required('Admin name is required'),
        email:    Yup.string().email('Invalid email').required('Admin email is required'),
        password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    })
});

function AddOrganization() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const initialValues = {
        name:         '',
        email:        '',
        subdomain:    '',
        primaryColor: '#4361ee',
        secondaryColor: '#424242',
        secondaryColor: '#424242',
        features: {
            smsAlerts: true, invoicing: true, expenses: true,
            extraIncome: true, staffManagement: true,
            ispManagement: true, dashboard: true,
        },
        adminUser: {
            name: '', email: '', password: '',
            type: 'orgAdmin',
            mobile: '00000000000', address: 'N/A', cnic: '0000000000000', share: 0,
        }
    };

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        setIsError(false);
        const payload = { ...values, mobile: '00000000000', address: 'N/A' };
        jwt.createOrganization(payload)
            .then(() => {
                setIsLoading(false);
                resetForm();
                navigate('/dashboard/all-organizations');
            })
            .catch((err) => {
                setIsLoading(false);
                setIsError(true);
                setErrorMessage(err?.response?.data?.message || 'Something went wrong');
            });
    };

    return (
        <Box sx={{ maxWidth: 800 }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Add Organization</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Basic info to get started. Admin can update more details from settings later.
            </Typography>

            {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        {/* Organization */}
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>Organization</Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Organization Name *</InputLabel>
                                    <OutlinedInput name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} label="Organization Name *" />
                                    {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Email *</InputLabel>
                                    <OutlinedInput name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} label="Email *" />
                                    {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Subdomain *</InputLabel>
                                    <OutlinedInput
                                        name="subdomain" value={values.subdomain}
                                        onChange={handleChange} onBlur={handleBlur}
                                        label="Subdomain *" inputProps={{ pattern: '[a-z0-9\\-]+' }}
                                    />
                                    <FormHelperText error={touched.subdomain && Boolean(errors.subdomain)}>
                                        {touched.subdomain && errors.subdomain ? errors.subdomain : 'e.g. bahawalpur or multan-city'}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ColorPickerField
                                    label="Primary Color"
                                    value={values.primaryColor}
                                    onChange={(color) => setFieldValue('primaryColor', color)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ColorPickerField
                                    label="Secondary Color"
                                    value={values.secondaryColor}
                                    onChange={(color) => setFieldValue('secondaryColor', color)}
                                />
                            </Grid>
                        </Grid>

                        {/* Admin Account */}
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>Admin Account</Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Admin Name *</InputLabel>
                                    <OutlinedInput name="adminUser.name" value={values.adminUser.name} onChange={handleChange} onBlur={handleBlur} label="Admin Name *" />
                                    {touched.adminUser?.name && errors.adminUser?.name && <FormHelperText error>{errors.adminUser.name}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Admin Email *</InputLabel>
                                    <OutlinedInput name="adminUser.email" value={values.adminUser.email} onChange={handleChange} onBlur={handleBlur} label="Admin Email *" />
                                    {touched.adminUser?.email && errors.adminUser?.email && <FormHelperText error>{errors.adminUser.email}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Password *</InputLabel>
                                    <OutlinedInput type="password" name="adminUser.password" value={values.adminUser.password} onChange={handleChange} onBlur={handleBlur} label="Password *" />
                                    {touched.adminUser?.password && errors.adminUser?.password && <FormHelperText error>{errors.adminUser.password}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Features */}
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>Features</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            All enabled by default. Turn off what this organization does not need.
                        </Typography>
                        <Grid container spacing={0.5} sx={{ mb: 3 }}>
                            {Object.keys(values.features).map((key) => (
                                <Grid item xs={6} md={4} key={key}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.features[key]}
                                                onChange={(e) => setFieldValue(`features.${key}`, e.target.checked)}
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="body2">{FEATURE_LABELS[key] || key}</Typography>}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <SimpleButton isValid={isLoading} title="Create Organization" />
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default AddOrganization;