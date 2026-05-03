import { Alert, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Checkbox, FormControlLabel, Switch, Box, Typography, Paper, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { HexColorPicker } from 'react-colorful';

const FEATURE_LABELS = {
    smsAlerts:       'SMS Alerts',
    invoicing:       'Invoicing',
    expenses:        'Expenses',
    extraIncome:     'Extra Income',
    staffManagement: 'Staff Management',
    ispManagement:   'ISP Management',
    dashboard:       'Dashboard',
};

// Reusable color picker component
const ColorPickerField = ({ label, value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    return (
        <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Color preview box — click to open picker */}
                <Box
                    onClick={handleClick}
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: value,
                        border: '2px solid #e0e0e0',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                />
                {/* Hex input */}
                <OutlinedInput
                    size="small"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ width: 140, fontFamily: 'monospace' }}
                    inputProps={{ maxLength: 7 }}
                />
            </Box>

            {/* Color picker popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
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

function EditOrganization() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        jwt.getOrganization(id)
            .then((res) => {
                const org = res?.data;
                setInitialValues({
                    name:           org.name           || '',
                    email:          org.email          || '',
                    mobile:         org.mobile         || '',
                    address:        org.address        || '',
                    subdomain:      org.subdomain      || '',
                    primaryColor:   org.primaryColor   || '#f07911',
                    secondaryColor: org.secondaryColor || '#424242',
                    status:         org.status         || 'active',
                    features: {
                        smsAlerts:       org.features?.smsAlerts       ?? true,
                        invoicing:       org.features?.invoicing       ?? true,
                        expenses:        org.features?.expenses        ?? true,
                        extraIncome:     org.features?.extraIncome     ?? true,
                        staffManagement: org.features?.staffManagement ?? true,
                        ispManagement:   org.features?.ispManagement   ?? true,
                        dashboard:       org.features?.dashboard       ?? true,
                    }
                });
                setIsFetching(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message || 'Organization load failed');
                setIsError(true);
                setIsFetching(false);
            });
    }, [id]);

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        const { features, ...orgData } = values;

        jwt.updateOrganization(id, orgData)
            .then(() => jwt.updateOrganizationFeatures(id, features))
            .then(() => {
                setIsLoading(false);
                alert('Organization Updated!');
                navigate('/dashboard/all-organizations');
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message || 'Update failed');
                setIsError(true);
                setIsLoading(false);
            });
    };

    if (isFetching) return <h3>Loading...</h3>;
    if (isError && !initialValues) return <Alert severity="error">{errorMessage}</Alert>;

    return (
        <>
            <h3>Edit Organization</h3>
            {isError && <Alert severity="error">{errorMessage}</Alert>}

            <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
                {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        {/* Organization Info */}
                        <h4>Organization Details</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Organization Name</InputLabel>
                                    <OutlinedInput name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} label="Organization Name" />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Email</InputLabel>
                                    <OutlinedInput name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} label="Email" />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Mobile</InputLabel>
                                    <OutlinedInput name="mobile" value={values.mobile} onChange={handleChange} onBlur={handleBlur} label="Mobile" />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Address</InputLabel>
                                    <OutlinedInput name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} label="Address" />
                                </FormControl>
                            </Grid>

                            {/* Subdomain */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Subdomain</InputLabel>
                                    <OutlinedInput
                                        name="subdomain"
                                        value={values.subdomain}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Subdomain"
                                        inputProps={{ pattern: '[a-z0-9-]+' }}
                                    />
                                    <FormHelperText>
                                        Lowercase letters, numbers and hyphen only. Example: bahawalpur, multan-city
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Status Toggle */}
                            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values.status === 'active'}
                                            onChange={(e) => setFieldValue('status', e.target.checked ? 'active' : 'inactive')}
                                            color="success"
                                        />
                                    }
                                    label={`Status: ${values.status === 'active' ? 'Active' : 'Inactive'}`}
                                />
                            </Grid>

                            {/* Color Pickers */}
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

                        {/* Feature Flags */}
                        <h4>Features</h4>
                        <Grid container spacing={1}>
                            {Object.keys(values.features).map((feature) => (
                                <Grid item xs={6} md={4} key={feature}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.features[feature]}
                                                onChange={(e) => setFieldValue(`features.${feature}`, e.target.checked)}
                                            />
                                        }
                                        label={FEATURE_LABELS[feature] || feature}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            <SimpleButton isValid={isLoading} title="Update Organization" />
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default EditOrganization;