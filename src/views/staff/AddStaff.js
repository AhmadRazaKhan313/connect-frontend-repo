import {
    Alert, FormControl, FormHelperText, Grid,
    InputLabel, MenuItem, OutlinedInput, Select,
    Typography, Box, Chip, Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useTheme } from '@mui/material/styles';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { AddStaffValidationSchema } from '../../utils/ValidationSchemas';

// Har type ki complete info — role bhi define hai
// orgSuperAdmin is NOT included — it is auto-created when an organization is added
const STAFF_TYPE_OPTIONS = [
    {
        value: 'orgAdmin',
        label: 'Org Admin',
        autoRole: 'orgAdmin',
        roleLabel: 'Org Admin (Auto)',
        description: 'Admin access — full control within organization',
        color: '#1565c0',
        requiresCustomRole: false,
    },
    {
        value: 'orgStaff',
        label: 'Org Staff',
        autoRole: 'orgStaff',
        roleLabel: null,
        description: 'Limited access — permissions defined by custom role',
        color: '#2e7d32',
        requiresCustomRole: true,
    },
    {
        value: 'partner',
        label: 'Partner',
        autoRole: null,
        roleLabel: 'No platform role (Financial only)',
        description: 'Financial partner only — for profit sharing',
        color: '#e65100',
        requiresCustomRole: true,
    },
];

function AddStaff() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(true);

    useEffect(() => {
        // getCustomRoles: sirf DB roles, system roles (platformSuperAdmin etc.) nahi
        jwt.getCustomRoles()
            .then((res) => {
                setRoles(res?.data || []);
                setRolesLoading(false);
            })
            .catch(() => setRolesLoading(false));
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
        const payload = { ...values };
        if (!payload.roleId) delete payload.roleId;

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

    const getTypeInfo = (type) => STAFF_TYPE_OPTIONS.find((t) => t.value === type);

    return (
        <>
            <h3>Add Staff Member</h3>

            {/* Important notice */}
            <Alert severity="info" icon={<AssignmentIndIcon />} sx={{ mb: 2 }}>
                <strong>Every user must be assigned a role</strong> — Selecting a type will automatically assign a system role.
                Org Staff must also select a custom role.
            </Alert>

            {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Formik initialValues={initialValues} validationSchema={AddStaffValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, isValid, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
                    const typeInfo = getTypeInfo(values.type);

                    return (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>

                                {/* Full Name */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>Full Name *</InputLabel>
                                        <OutlinedInput name="fullname" type="text" value={values.fullname}
                                            onBlur={handleBlur} onChange={handleChange} label="Full Name *" />
                                        {touched.fullname && errors.fullname && <FormHelperText error>{errors.fullname}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>Email *</InputLabel>
                                        <OutlinedInput name="email" type="text" value={values.email}
                                            onBlur={handleBlur} onChange={handleChange} label="Email *" />
                                        {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {/* Password */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>Password *</InputLabel>
                                        <OutlinedInput name="password" type="password" value={values.password}
                                            onBlur={handleBlur} onChange={handleChange} label="Password *" />
                                        {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {/* CNIC */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>CNIC *</InputLabel>
                                        <OutlinedInput name="cnic" type="text" value={values.cnic}
                                            onBlur={handleBlur} onChange={handleChange} label="CNIC *" />
                                        {touched.cnic && errors.cnic && <FormHelperText error>{errors.cnic}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {/* Mobile */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>Mobile *</InputLabel>
                                        <OutlinedInput name="mobile" type="text" value={values.mobile}
                                            onBlur={handleBlur} onChange={handleChange} label="Mobile *" />
                                        {touched.mobile && errors.mobile && <FormHelperText error>{errors.mobile}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {/* Address */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>Address *</InputLabel>
                                        <OutlinedInput name="address" type="text" value={values.address}
                                            onBlur={handleBlur} onChange={handleChange} label="Address *" />
                                        {touched.address && errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                                Role & Access Setup
                            </Typography>

                            <Grid container spacing={2}>

                                {/* Staff Type */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                        <InputLabel>Staff Type * (Defines Role)</InputLabel>
                                        <Select
                                            name="type" value={values.type}
                                            label="Staff Type * (Defines Role)"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldValue('type', e.target.value);
                                                if (e.target.value !== 'partner') setFieldValue('share', 0);
                                                setFieldValue('roleId', ''); // reset custom role
                                            }}
                                            sx={{ paddingTop: '10px' }}
                                        >
                                            {STAFF_TYPE_OPTIONS.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" fontWeight={700}>{opt.label}</Typography>
                                                            {!opt.requiresCustomRole && opt.autoRole && (
                                                                <Chip label="Auto Role" size="small"
                                                                    sx={{ fontSize: 9, height: 16, backgroundColor: opt.color + '20', color: opt.color }} />
                                                            )}
                                                            {opt.requiresCustomRole && (
                                                                <Chip label="Custom Role Required" size="small"
                                                                    sx={{ fontSize: 9, height: 16, backgroundColor: '#d32f2f20', color: '#d32f2f' }} />
                                                            )}
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">{opt.description}</Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.type && errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {/* Role Preview Box — type select hone ke baad */}
                                {typeInfo && (
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{
                                            p: 1.5, borderRadius: 2, height: '100%',
                                            backgroundColor: typeInfo.color + '10',
                                            border: `1.5px solid ${typeInfo.color}40`,
                                            display: 'flex', flexDirection: 'column', justifyContent: 'center'
                                        }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                ROLE ASSIGNED TO THIS USER:
                                            </Typography>
                                            {typeInfo.autoRole ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <CheckCircleIcon sx={{ color: typeInfo.color, fontSize: 18 }} />
                                                    <Typography variant="body2" fontWeight={700} sx={{ color: typeInfo.color }}>
                                                        {typeInfo.requiresCustomRole
                                                            ? (values.roleId
                                                                ? roles.find(r => r.id === values.roleId)?.name || 'Custom Role Selected'
                                                                : '⚠ Not selected yet')
                                                            : typeInfo.roleLabel
                                                        }
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <LockIcon sx={{ color: '#999', fontSize: 18 }} />
                                                    <Typography variant="body2" color="text.secondary">{typeInfo.roleLabel}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                )}

                                {/* Share — sirf partner ke liye */}
                                {values.type === 'partner' && (
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                            <InputLabel>Profit Share % *</InputLabel>
                                            <OutlinedInput name="share" type="number" value={values.share}
                                                onBlur={handleBlur} onChange={handleChange}
                                                label="Profit Share % *" inputProps={{ min: 0, max: 100 }} />
                                            {touched.share && errors.share && <FormHelperText error>{errors.share}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                )}

                                {/* Custom Role — orgStaff aur partner dono ke liye MANDATORY */}
                                {(values.type === 'orgStaff' || values.type === 'partner') && (
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                            <InputLabel>Assign Role *</InputLabel>
                                            <Select
                                                name="roleId" value={values.roleId}
                                                label="Assign Role *"
                                                onBlur={handleBlur} onChange={handleChange}
                                                sx={{ paddingTop: '10px' }}
                                            >
                                                {rolesLoading ? (
                                                    <MenuItem disabled>Roles load ho rahe hain...</MenuItem>
                                                ) : roles.length === 0 ? (
                                                    <MenuItem disabled value="">
                                                        ⚠ No custom roles found — create a role in the Roles section first
                                                    </MenuItem>
                                                ) : (
                                                    roles.map((role) => (
                                                        <MenuItem key={role.id} value={role.id}>
                                                            {role.name}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            {touched.roleId && errors.roleId && <FormHelperText error>{errors.roleId}</FormHelperText>}
                                            {roles.length === 0 && !rolesLoading && (
                                                <FormHelperText sx={{ color: '#e65100' }}>
                                                    At least one custom role must exist before adding Org Staff
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                )}

                            </Grid>

                            {/* Welcome SMS */}
                            <Box sx={{ mt: 2, mb: 1 }}>
                                <label htmlFor="sendWelcomeMessage" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <Field id="sendWelcomeMessage" name="sendWelcomeMessage" type="checkbox" checked={values.sendWelcomeMessage} />
                                    <Typography variant="body2">Send welcome message via SMS</Typography>
                                </label>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Grid sx={{ width: '200px' }}>
                                    <SimpleButton isValid={!isValid || isLoading} title="Add Staff" />
                                </Grid>
                            </Box>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
}

export default AddStaff;