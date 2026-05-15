import { Alert, Box, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import * as Yup from 'yup';
import axios from 'axios';
import { HexColorPicker } from 'react-colorful';
import { Popover, Paper } from '@mui/material';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api/v1';

const validationSchema = Yup.object().shape({
    orgName:         Yup.string().required('Organization name is required'),
    orgEmail:        Yup.string().email('Invalid email').required('Email is required'),
    subdomain:       Yup.string().matches(/^[a-z0-9-]+$/, 'Lowercase, numbers and hyphen only').required('Subdomain is required'),
    adminName:       Yup.string().required('Admin name is required'),
    adminEmail:      Yup.string().email('Invalid email').required('Admin email is required'),
    adminPassword:   Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('adminPassword')], 'Passwords do not match').required('Confirm password'),
});

const STEPS = ['Organization', 'Admin Account'];

const ColorPickerField = ({ label, value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    return (
        <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        width: 40, height: 40, borderRadius: 2,
                        backgroundColor: value, border: '2px solid #e2e8f0',
                        cursor: 'pointer', flexShrink: 0,
                        '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
                    }}
                />
                <OutlinedInput
                    size="small" value={value}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ fontFamily: 'monospace', fontSize: 13 }}
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

function Setup() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [status, setStatus] = useState('checking');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successSubdomain, setSuccessSubdomain] = useState('');
    const [step, setStep] = useState(0);

    useEffect(() => {
        axios.get(`${BASE_URL}/auth/setup`)
            .then((res) => setStatus(res.data.isSetupDone ? 'done' : 'open'))
            .catch(() => setStatus('open'));
    }, []);

    const onSubmit = (values) => {
        setIsLoading(true);
        setIsError(false);
        axios.post(`${BASE_URL}/auth/setup`, values)
            .then((res) => {
                setIsLoading(false);
                setSuccessSubdomain(res.data.subdomain);
            })
            .catch((err) => {
                setIsLoading(false);
                setIsError(true);
                setErrorMessage(err?.response?.data?.message || 'Something went wrong');
            });
    };

    if (status === 'checking') return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Typography color="text.secondary">Loading...</Typography>
        </Box>
    );

    if (status === 'done') return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}>
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ fontSize: 48, mb: 2 }}>🔒</Box>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>Setup Complete</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>This page has been disabled.</Typography>
                <Typography
                    variant="body2"
                    sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate('/login')}
                >
                    Go to Login →
                </Typography>
            </Box>
        </Box>
    );

    if (successSubdomain) return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
        }}>
            <Box sx={{ textAlign: 'center', p: 4, maxWidth: 420 }}>
                <Box sx={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: '#16a34a', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', mx: 'auto', mb: 3
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Box>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>You're all set!</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>Your organization has been created.</Typography>
                <Typography variant="body2" sx={{ mb: 3, fontFamily: 'monospace', background: '#f1f5f9', px: 2, py: 1, borderRadius: 2, display: 'inline-block' }}>
                    {successSubdomain}.localhost:3000
                </Typography>
                <Box>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'white', background: '#16a34a', cursor: 'pointer',
                            px: 3, py: 1.5, borderRadius: 2, display: 'inline-block', fontWeight: 500
                        }}
                        onClick={() => window.location.replace(`http://${successSubdomain}.localhost:3000/login`)}
                    >
                        Login to your organization →
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
        }}>
            {/* Left Panel */}
            <Box sx={{
                width: { xs: 0, md: '40%' },
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(160deg, #1e3a5f 0%, #2563eb 100%)',
                p: 6,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute', top: -80, right: -80,
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)'
                }} />
                <Box sx={{
                    position: 'absolute', bottom: -60, left: -60,
                    width: 250, height: 250, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)'
                }} />
                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Box sx={{
                        width: 56, height: 56, borderRadius: 2,
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 4,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Box>
                    <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 2, fontSize: 28 }}>
                        Welcome aboard
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: 15 }}>
                        Set up your first organization in just a few steps. This page will be automatically disabled after setup.
                    </Typography>

                    <Box sx={{ mt: 6 }}>
                        {STEPS.map((s, i) => (
                            <Box key={i} sx={{
                                display: 'flex', alignItems: 'center', gap: 2, mb: 2,
                                opacity: i <= step ? 1 : 0.4,
                                transition: 'opacity 0.3s'
                            }}>
                                <Box sx={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: i < step ? '#16a34a' : i === step ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: i === step ? '2px solid white' : '2px solid transparent',
                                    transition: 'all 0.3s',
                                    flexShrink: 0
                                }}>
                                    {i < step ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <Typography sx={{ color: 'white', fontSize: 11, fontWeight: 600 }}>{i + 1}</Typography>
                                    )}
                                </Box>
                                <Typography sx={{ color: 'white', fontSize: 14, fontWeight: i === step ? 600 : 400 }}>{s}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Right Panel — Form */}
            <Box sx={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                p: { xs: 3, md: 6 }, background: '#fff'
            }}>
                <Box sx={{ width: '100%', maxWidth: 480 }}>
                    {/* Progress */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">Step {step + 1} of {STEPS.length}</Typography>
                            <Typography variant="caption" color="text.secondary">{STEPS[step]}</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={((step + 1) / STEPS.length) * 100}
                            sx={{ height: 4, borderRadius: 2, background: '#f1f5f9', '& .MuiLinearProgress-bar': { borderRadius: 2 } }}
                        />
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {step === 0 ? 'Organization details' : 'Admin account'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {step === 0
                            ? 'Tell us about your organization.'
                            : 'Create the admin account for this organization.'}
                    </Typography>

                    {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

                    <Formik
                        initialValues={{ orgName: '', orgEmail: '', subdomain: '', primaryColor: '#f07911', secondaryColor: '#424242', adminName: '', adminEmail: '', adminPassword: '', confirmPassword: '' }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, validateForm, setTouched, setFieldValue }) => (
                            <form onSubmit={handleSubmit}>
                                {step === 0 && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel>Organization Name *</InputLabel>
                                                <OutlinedInput name="orgName" value={values.orgName} onChange={handleChange} onBlur={handleBlur} label="Organization Name *" />
                                                {touched.orgName && errors.orgName && <FormHelperText error>{errors.orgName}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel>Organization Email *</InputLabel>
                                                <OutlinedInput name="orgEmail" value={values.orgEmail} onChange={handleChange} onBlur={handleBlur} label="Organization Email *" />
                                                {touched.orgEmail && errors.orgEmail && <FormHelperText error>{errors.orgEmail}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel>Subdomain *</InputLabel>
                                                <OutlinedInput name="subdomain" value={values.subdomain} onChange={handleChange} onBlur={handleBlur} label="Subdomain *" />
                                                <FormHelperText error={touched.subdomain && Boolean(errors.subdomain)}>
                                                    {touched.subdomain && errors.subdomain ? errors.subdomain : `Your dashboard: ${values.subdomain || 'yourname'}.connectlodhran.com`}
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
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Box
                                                onClick={async () => {
                                                    const errs = await validateForm();
                                                    const step0Fields = ['orgName', 'orgEmail', 'subdomain'];
                                                    const hasErrors = step0Fields.some(f => errs[f]);
                                                    if (hasErrors) {
                                                        setTouched({ orgName: true, orgEmail: true, subdomain: true });
                                                    } else {
                                                        setStep(1);
                                                    }
                                                }}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                                                    color: 'white', py: 1.5, borderRadius: 2,
                                                    textAlign: 'center', cursor: 'pointer', fontWeight: 500,
                                                    fontSize: 15, transition: 'opacity 0.2s',
                                                    '&:hover': { opacity: 0.9 }
                                                }}
                                            >
                                                Continue →
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}

                                {step === 1 && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel>Admin Name *</InputLabel>
                                                <OutlinedInput name="adminName" value={values.adminName} onChange={handleChange} onBlur={handleBlur} label="Admin Name *" />
                                                {touched.adminName && errors.adminName && <FormHelperText error>{errors.adminName}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel>Admin Email *</InputLabel>
                                                <OutlinedInput name="adminEmail" value={values.adminEmail} onChange={handleChange} onBlur={handleBlur} label="Admin Email *" />
                                                {touched.adminEmail && errors.adminEmail && <FormHelperText error>{errors.adminEmail}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel>Password *</InputLabel>
                                                <OutlinedInput type="password" name="adminPassword" value={values.adminPassword} onChange={handleChange} onBlur={handleBlur} label="Password *" />
                                                {touched.adminPassword && errors.adminPassword && <FormHelperText error>{errors.adminPassword}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                <InputLabel>Confirm Password *</InputLabel>
                                                <OutlinedInput type="password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} label="Confirm Password *" />
                                                {touched.confirmPassword && errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                            <Box
                                                onClick={() => setStep(0)}
                                                sx={{
                                                    border: '1px solid #e2e8f0', color: '#64748b',
                                                    py: 1.5, px: 3, borderRadius: 2, cursor: 'pointer',
                                                    fontWeight: 500, fontSize: 15, textAlign: 'center',
                                                    '&:hover': { background: '#f8fafc' }
                                                }}
                                            >
                                                ← Back
                                            </Box>
                                            <Box
                                                onClick={handleSubmit}
                                                sx={{
                                                    flex: 1,
                                                    background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                                                    color: 'white', py: 1.5, borderRadius: 2,
                                                    textAlign: 'center', cursor: isLoading ? 'not-allowed' : 'pointer',
                                                    fontWeight: 500, fontSize: 15,
                                                    '&:hover': { opacity: isLoading ? 1 : 0.9 }
                                                }}
                                            >
                                                {isLoading ? 'Creating...' : 'Create Organization'}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    );
}

export default Setup;