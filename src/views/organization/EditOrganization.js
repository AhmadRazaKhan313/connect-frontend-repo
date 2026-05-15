import { Alert, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Checkbox, FormControlLabel, Switch, Box, Typography, Paper, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { HexColorPicker } from 'react-colorful';
import useAppContext from 'context/useAppContext';

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
                        width: 48, height: 48, borderRadius: 2,
                        backgroundColor: value, border: '2px solid #e0e0e0',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }
                    }}
                />
                <OutlinedInput
                    size="small" value={value}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ width: 140, fontFamily: 'monospace' }}
                    inputProps={{ maxLength: 7 }}
                />
            </Box>
            <Popover
                open={open} anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                disableEnforceFocus disableAutoFocus
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
    const { fetchOrgInfo } = useAppContext(); // sidebar refresh ke liye

    const [isLoading, setIsLoading]       = useState(false);
    const [isFetching, setIsFetching]     = useState(true);
    const [isError, setIsError]           = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [initialValues, setInitialValues] = useState(null);
    const [logoPreview, setLogoPreview]   = useState(null);
    const [logoBase64, setLogoBase64]     = useState(null);

    useEffect(() => {
        jwt.getOrganization(id)
            .then((res) => {
                const org = res?.data;
                setLogoPreview(org.logo || null);
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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('Logo size should be less than 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoBase64(reader.result);
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        setIsError(false);
        const { features, ...orgData } = values;

        try {
            // Step 1: org info update
            await jwt.updateOrganization(id, orgData);

            // Step 2: features update
            await jwt.updateOrganizationFeatures(id, features);

            // Step 3: logo upload — base64 as JSON body (backend reads req.body.logo)
            // Bug fix: ab updateOrganization mein base64 nahi bhejte — dedicated endpoint use karo
            if (logoBase64) {
                await jwt.uploadOrgLogo(id, logoBase64);
            }

            // Bug fix: cache clear karo — warna sidebar mein purana logo/colors dikhega
            localStorage.removeItem('org_branding');
            localStorage.removeItem('org_colors');

            // Sidebar mein fresh data fetch karo
            await fetchOrgInfo();

            setIsLoading(false);
            alert('Organization Updated!');
            navigate('/dashboard/all-organizations');

        } catch (err) {
            setErrorMessage(err?.response?.data?.message || 'Update failed');
            setIsError(true);
            setIsLoading(false);
        }
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
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel>Subdomain</InputLabel>
                                    <OutlinedInput
                                        name="subdomain" value={values.subdomain}
                                        onChange={handleChange} onBlur={handleBlur}
                                        label="Subdomain" inputProps={{ pattern: '[a-z0-9-]+' }}
                                    />
                                    <FormHelperText>
                                        Lowercase letters, numbers and hyphen only. e.g. bahawalpur, multan-city
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
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

                            {/* Logo Upload */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Organization Logo</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    {logoPreview && (
                                        <Box
                                            component="img" src={logoPreview} alt="Org Logo"
                                            sx={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 2, border: '1px solid #e0e0e0', p: 0.5 }}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    )}
                                    <Box>
                                        <input accept="image/*" id="logo-upload" type="file" style={{ display: 'none' }} onChange={handleLogoChange} />
                                        <label htmlFor="logo-upload">
                                            <Box component="span" sx={{
                                                display: 'inline-block', px: 2, py: 1,
                                                border: '1px dashed #aaa', borderRadius: 2,
                                                cursor: 'pointer', fontSize: '0.85rem', color: '#555',
                                                '&:hover': { borderColor: '#4361ee', color: '#4361ee' }
                                            }}>
                                                {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                            </Box>
                                        </label>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                            PNG, JPG — max 2MB
                                        </Typography>
                                        {logoBase64 && (
                                            <Typography variant="caption" color="success.main">✓ New logo ready to save</Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <ColorPickerField label="Primary Color" value={values.primaryColor} onChange={(c) => setFieldValue('primaryColor', c)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ColorPickerField label="Secondary Color" value={values.secondaryColor} onChange={(c) => setFieldValue('secondaryColor', c)} />
                            </Grid>
                        </Grid>

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
