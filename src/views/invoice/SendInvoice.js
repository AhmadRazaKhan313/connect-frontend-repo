import { Alert, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import SimpleButton from 'ui-component/SimpleButton';
import { PAYMENT_METHODS } from 'utils/Constants';
import useOrgTheme from 'utils/useOrgTheme';

import { SendInvoiceValidationSchema } from '../../utils/ValidationSchemas';

function SendInvoice() {
    const theme = useTheme();
    const [isps, setIsps] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { primaryColor } = useOrgTheme();
    const [colorBg, setColorBg] = useState(primaryColor);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        jwt.getAllIsps()
            .then((res) => {
                setIsps(res?.data);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    const initialValues = {
        isp: '',
        date: '',
        paymentMethod: '',
        tid: '',
        amount: '',
        comments: ''
    };

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        jwt.createInvoice(values)
            .then((res) => {
                setIsLoading(false);
                setIsError(false);
                alert('Invoice Sent');
                resetForm();
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const handleIspSelectChange = (event, setFieldValue) => {
        const ispId = event.target.value;
        setFieldValue('isp', ispId);
        getIspById(ispId);
    };

    const handlePaymentMethodChange = (event, setFieldValue) => {
        const paymentMethod = event.target.value;
        setFieldValue('paymentMethod', paymentMethod);
        if (paymentMethod === 'net' || paymentMethod === 'pending') {
            setFieldValue('tid', '');
        }
        if (paymentMethod === 'pending') {
            setFieldValue('amount', 0);
        }
    };

    const getIspById = (isp) => {
        jwt.getIspById(isp)
            .then((res) => {
                setColorBg(res?.data?.color);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    return (
        <>
            <h3>Send Invoice Details</h3>
            {isLoading && <h3>Loading...!</h3>}
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={SendInvoiceValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Select User's ISP </InputLabel>
                                    <Select
                                        id="isp"
                                        name="isp"
                                        type="text"
                                        value={values.isp}
                                        onBlur={handleBlur}
                                        onChange={(event) => handleIspSelectChange(event, setFieldValue)}
                                        label="User's ISP"
                                        sx={{ paddingTop: '15px' }}
                                    >
                                        {isps.map((isp) => (
                                            <MenuItem key={isp.id} value={isp.id}>{isp.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.isp && (
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {errors.isp}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Date </InputLabel>
                                    <OutlinedInput
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={values.date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Date"
                                        sx={{ paddingTop: '5px' }}
                                    />
                                    {errors.date && (
                                        <FormHelperText error id="standard-weight-helper-text-date">
                                            {errors.date}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Select Payment Method </InputLabel>
                                    <Select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        type="text"
                                        value={values.paymentMethod}
                                        onBlur={handleBlur}
                                        onChange={(event) => handlePaymentMethodChange(event, setFieldValue)}
                                        label="Select Payment Method"
                                        sx={{ paddingTop: '15px' }}
                                    >
                                        {PAYMENT_METHODS.map(
                                            (item) => item.key !== 'pending' &&  <MenuItem key={item.key} value={item.key}>{item.value}</MenuItem>
                                        )}
                                    </Select>
                                    {errors.paymentMethod && (
                                        <FormHelperText error id="standard-weight-helper-text-paymentMethod">
                                            {errors.paymentMethod}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> TID </InputLabel>
                                    <OutlinedInput
                                        id="tid"
                                        name="tid"
                                        type="text"
                                        value={values.tid}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="TID"
                                        sx={{ paddingTop: '5px' }}
                                        disabled={values.paymentMethod === 'net'}
                                    />
                                    {errors.tid && (
                                        <FormHelperText error id="standard-weight-helper-text-tid">
                                            {errors.tid}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Amount </InputLabel>
                                    <OutlinedInput
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        value={values.amount}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Amount"
                                        inputProps={{ min: 1 }}
                                    />
                                    {errors.amount && (
                                        <FormHelperText error id="standard-weight-helper-text-sale-rate">
                                            {errors.amount}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Comments </InputLabel>
                                    <OutlinedInput
                                        id="comments"
                                        name="comments"
                                        type="text"
                                        value={values.comments}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Comments"
                                        inputProps={{ min: 1 }}
                                    />
                                    {errors.comments && (
                                        <FormHelperText error id="standard-weight-helper-text-comments">
                                            {errors.comments}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid} title="Send Invoice" color={colorBg} />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default SendInvoice;
