import { Alert, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useState } from 'react';
import { CirclePicker } from 'react-color';
import { useLocation, useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';

import { AddISPValidationSchema } from '../../utils/ValidationSchemas';

function EditISP() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isp } = useLocation()?.state;
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMssage] = useState('');

    const initialValues = {
        name: isp?.name,
        vlan: isp?.vlan,
        openingBalance: isp?.openingBalance,
        staticIpRate: isp?.staticIpRate,
        color: isp?.color
    };

    const onSubmit = (values) => {
        setIsLoading(true);
        jwt.editIsp(isp?.id, values)
            .then((res) => {
                setIsLoading(false);
                alert('Isp Edited');
                navigate('/dashboard/all-isps');
            })
            .catch((err) => {
                setIsLoading(false);
                setIsError(true);
                setErrorMssage(err?.response?.data?.message);
            });
    };

    return (
        <>
            <h3>Add ISP Details</h3>
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={AddISPValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel> Edit Name </InputLabel>
                            <OutlinedInput
                                id="name"
                                name="name"
                                type="text"
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="ISP Name"
                                inputProps={{}}
                            />
                            {errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-isp-name">
                                    {errors.name}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel> ISP VLAN </InputLabel>
                            <OutlinedInput
                                id="vlan"
                                name="vlan"
                                type="number"
                                value={values.vlan}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="ISP VLAN"
                                inputProps={{ min: 1 }}
                            />
                            {errors.vlan && (
                                <FormHelperText error id="standard-weight-helper-text-isp-vlan">
                                    {errors.vlan}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel> Opening Balance </InputLabel>
                            <OutlinedInput
                                id="openingBalance"
                                name="openingBalance"
                                type="number"
                                value={values.openingBalance}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Opening Balance"
                            />
                            {errors.openingBalance && (
                                <FormHelperText error id="standard-weight-helper-text-isp-openingBalance">
                                    {errors.openingBalance}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                            <InputLabel> Static Ip Rate </InputLabel>
                            <OutlinedInput
                                id="staticIpRate"
                                name="staticIpRate"
                                type="number"
                                value={values.staticIpRate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Static Ip Rate"
                                inputProps={{ min: 0 }}
                            />
                            {errors.staticIpRate && (
                                <FormHelperText error id="standard-weight-helper-text-isp-staticIpRate">
                                    {errors.staticIpRate}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <div style={{ marginTop: '10px' }}>
                            <Field name="color">
                                {({ field, meta }) => (
                                    <div>
                                        <label htmlFor="color">Select a color:</label>
                                        <CirclePicker
                                            id="color"
                                            name="color"
                                            {...field}
                                            onChange={(color) => {
                                                setFieldValue('color', color.hex);
                                            }}
                                        />
                                        {meta.touched && meta.error && (
                                            <FormHelperText error id="standard-weight-helper-text-isp-vlan">
                                                {meta.error}
                                            </FormHelperText>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '120px' }}>
                                <SimpleButton isValid={!isValid || isLoading} title="Edit ISP" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default EditISP;
