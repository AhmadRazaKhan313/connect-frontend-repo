import { Alert, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState, useEffect } from 'react';
import { CirclePicker } from 'react-color';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { AddISPValidationSchema } from '../../utils/ValidationSchemas';

function AddISP() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [organizations, setOrganizations] = useState([]);

    const currentUser = jwt.getUser();
    const isPlatformSuperAdmin =
        currentUser?.role === 'platformSuperAdmin' ||
        currentUser?.type === 'platformSuperAdmin';

    useEffect(() => {
        if (isPlatformSuperAdmin) {
            jwt.getAllOrganizations()
                .then((res) => setOrganizations(res?.data || []))
                .catch(() => {});
        }
    }, [isPlatformSuperAdmin]);

    const initialValues = {
        name: '',
        vlan: '',
        openingBalance: '',
        staticIpRate: '',
        color: '',
        organizationId: ''
    };

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        const payload = { ...values };

        // platformSuperAdmin ke liye organizationId bhejo, baaki ke liye hata do
        if (!isPlatformSuperAdmin) {
            delete payload.organizationId;
        } else if (!payload.organizationId) {
            setIsLoading(false);
            setIsError(true);
            setErrorMessage('Organization is required');
            return;
        }

        jwt.createIsp(payload)
            .then(() => {
                setIsLoading(false);
                alert('ISP added successfully!');
                resetForm();
                navigate('/dashboard/all-isps');
            })
            .catch((err) => {
                setIsLoading(false);
                setIsError(true);
                setErrorMessage(err?.response?.data?.message || 'Failed to add ISP');
            });
    };

    return (
        <>
            <h3>Add ISP Details</h3>
            {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Formik
                initialValues={initialValues}
                validationSchema={AddISPValidationSchema}
                validationContext={{ isPlatformSuperAdmin }}
                onSubmit={onSubmit}
            >
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        {/* Organization select — only for platformSuperAdmin, REQUIRED */}
                        {isPlatformSuperAdmin && (
                            <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
                                <InputLabel id="org-select-label">Select Organization *</InputLabel>
                                <Select
                                    labelId="org-select-label"
                                    id="organizationId"
                                    name="organizationId"
                                    value={values.organizationId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Select Organization *"
                                >
                                    <MenuItem value="">-- Select Organization --</MenuItem>
                                    {organizations.map((org) => (
                                        <MenuItem key={org.id} value={org.id}>
                                            {org.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.organizationId && errors.organizationId && (
                                    <FormHelperText error>{errors.organizationId}</FormHelperText>
                                )}
                            </FormControl>
                        )}

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel>ISP Name *</InputLabel>
                            <OutlinedInput
                                id="name" name="name" type="text"
                                value={values.name} onBlur={handleBlur} onChange={handleChange} label="ISP Name *"
                            />
                            {touched.name && errors.name && (
                                <FormHelperText error>{errors.name}</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel>ISP VLAN *</InputLabel>
                            <OutlinedInput
                                id="vlan" name="vlan" type="number"
                                value={values.vlan} onBlur={handleBlur} onChange={handleChange}
                                label="ISP VLAN *" inputProps={{ min: 1 }}
                            />
                            {touched.vlan && errors.vlan && (
                                <FormHelperText error>{errors.vlan}</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel>Opening Balance *</InputLabel>
                            <OutlinedInput
                                id="openingBalance" name="openingBalance" type="number"
                                value={values.openingBalance} onBlur={handleBlur} onChange={handleChange}
                                label="Opening Balance *"
                            />
                            {touched.openingBalance && errors.openingBalance && (
                                <FormHelperText error>{errors.openingBalance}</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel>Static IP Rate *</InputLabel>
                            <OutlinedInput
                                id="staticIpRate" name="staticIpRate" type="number"
                                value={values.staticIpRate} onBlur={handleBlur} onChange={handleChange}
                                label="Static IP Rate *" inputProps={{ min: 0 }}
                            />
                            {touched.staticIpRate && errors.staticIpRate && (
                                <FormHelperText error>{errors.staticIpRate}</FormHelperText>
                            )}
                        </FormControl>

                        <div style={{ marginTop: '10px' }}>
                            <Field name="color">
                                {({ field, meta }) => (
                                    <div>
                                        <label htmlFor="color">Select a color: *</label>
                                        <br />
                                        <CirclePicker
                                            id="color" name="color" {...field}
                                            onChange={(color) => setFieldValue('color', color.hex)}
                                        />
                                        {meta.touched && meta.error && (
                                            <FormHelperText error>{meta.error}</FormHelperText>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>

                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '150px' }}>
                                <SimpleButton isValid={!isValid || isLoading} title="Add ISP" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default AddISP;