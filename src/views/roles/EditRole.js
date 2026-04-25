import { useState, useEffect } from 'react';
import {
    Alert, Box, Button, Checkbox, Divider, FormControl,
    FormControlLabel, FormHelperText, Grid, InputLabel,
    OutlinedInput, Paper, Typography, CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import jwt from 'jwtservice/jwtService';
import { useNavigate, useParams } from 'react-router';
import useOrgTheme from 'utils/useOrgTheme';
import PERMISSIONS from 'utils/Permissions';
import SimpleButton from 'ui-component/SimpleButton';

const groupedPermissions = PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.group]) acc[perm.group] = [];
    acc[perm.group].push(perm);
    return acc;
}, {});

export default function EditRole() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const { primaryColor } = useOrgTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        jwt.getRoleById(id)
            .then((res) => {
                const role = res.data?.data || res.data;
                setInitialValues({
                    name: role.name,
                    permissions: role.permissions || []
                });
                setIsFetching(false);
            })
            .catch((err) => {
                setIsError(true);
                setErrorMessage(err?.response?.data?.message || 'Failed to load role');
                setIsFetching(false);
            });
    }, [id]);

    const handleGroupSelectAll = (group, checked, setFieldValue, values) => {
        const groupKeys = groupedPermissions[group].map((p) => p.key);
        if (checked) {
            const newPerms = [...new Set([...values.permissions, ...groupKeys])];
            setFieldValue('permissions', newPerms);
        } else {
            setFieldValue('permissions', values.permissions.filter((p) => !groupKeys.includes(p)));
        }
    };

    if (isFetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h3" sx={{ mb: 3 }}>Edit Role</Typography>

            {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('Role name is required'),
                    permissions: Yup.array().min(1, 'At least one permission is required')
                })}
                onSubmit={(values) => {
                    setIsLoading(true);
                    jwt.updateRole(id, values)
                        .then(() => {
                            setIsLoading(false);
                            alert('Role updated successfully!');
                            navigate('/dashboard/all-roles');
                        })
                        .catch((err) => {
                            setIsLoading(false);
                            setIsError(true);
                            setErrorMessage(err?.response?.data?.message || 'Something went wrong');
                        });
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isValid }) => (
                    <form onSubmit={handleSubmit}>
                        {/* Role Name */}
                        <FormControl fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
                            <InputLabel>Role Name</InputLabel>
                            <OutlinedInput
                                name="name"
                                type="text"
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Role Name"
                            />
                            {touched.name && errors.name && (
                                <FormHelperText error>{errors.name}</FormHelperText>
                            )}
                        </FormControl>

                        {/* Permissions */}
                        <Typography variant="h4" sx={{ mb: 1, mt: 2 }}>Permissions</Typography>
                        {touched.permissions && errors.permissions && (
                            <Alert severity="error" sx={{ mb: 2 }}>{errors.permissions}</Alert>
                        )}

                        <Grid container spacing={2}>
                            {Object.entries(groupedPermissions).map(([group, perms]) => {
                                const groupKeys = perms.map((p) => p.key);
                                const allSelected = groupKeys.every((k) => values.permissions.includes(k));
                                const someSelected = groupKeys.some((k) => values.permissions.includes(k));

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={group}>
                                        <Box sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            p: 2,
                                            height: '100%'
                                        }}>
                                            {/* Group Header */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Checkbox
                                                    checked={allSelected}
                                                    indeterminate={someSelected && !allSelected}
                                                    onChange={(e) => handleGroupSelectAll(group, e.target.checked, setFieldValue, values)}
                                                    sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }}
                                                />
                                                <Typography fontWeight="bold" variant="subtitle1">
                                                    {group}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ mb: 1 }} />

                                            {/* Individual Permissions */}
                                            {perms.map((perm) => (
                                                <FormControlLabel
                                                    key={perm.key}
                                                    control={
                                                        <Checkbox
                                                            checked={values.permissions.includes(perm.key)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setFieldValue('permissions', [...values.permissions, perm.key]);
                                                                } else {
                                                                    setFieldValue('permissions', values.permissions.filter((p) => p !== perm.key));
                                                                }
                                                            }}
                                                            sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor } }}
                                                        />
                                                    }
                                                    label={perm.label}
                                                    sx={{ display: 'block', ml: 1 }}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Buttons */}
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <SimpleButton
                                isValid={!isValid || isLoading}
                                title="Update Role"
                            />
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/dashboard/all-roles')}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Paper>
    );
}