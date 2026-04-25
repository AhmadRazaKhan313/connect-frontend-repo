import { useTheme } from '@emotion/react';
import { Alert, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import { useState } from 'react';
import SimpleButton from 'ui-component/SimpleButton';
import { PAYMENT_METHODS } from 'utils/Constants';

import { AddExpenseValidationSchema } from '../../utils/ValidationSchemas';
import jwt from 'jwtservice/jwtService';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import moment from 'moment';

const initialValues = {
    spentBy: 'company',
    paymentMethod: '',
    tid: '',
    amount: '',
    date: '',
    details: '',
    image: null
};

function AddExpense() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        getAllPartners();
    }, []);

    const onSubmit = (values, { resetForm }) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            for (const [key, value] of Object.entries(values)) {
                formData.append(key, value);
            }
            jwt.createExpense(formData)
                .then((res) => {
                    setIsLoading(false);
                    setErrorMessage('');
                    setIsError(false);
                    alert('Expense Added');
                    resetForm();
                })
                .catch((err) => {
                    setErrorMessage(err?.response?.data?.message);
                    setIsError(true);
                    setIsLoading(false);
                });
        } catch (e) {
            setErrorMessage(e.message);
            setIsError(true);
        }
    };

    const handlePaymentMethod = (event, setFieldValue) => {
        setFieldValue('paymentMethod', event.target.value);
        event.target.value === 'net' && setFieldValue('tid', '');
    };

    const getAllPartners = () => {
        try {
            setIsLoading(true);
            jwt.getAllPartners()
                .then((res) => {
                    setIsLoading(false);
                    setErrorMessage('');
                    setIsError(false);
                    setPartners(res?.data);
                })
                .catch((err) => {
                    setErrorMessage(err?.response?.data?.message);
                    setIsError(true);
                    setIsLoading(false);
                });
        } catch (e) {
            setErrorMessage(e.message);
            setIsError(true);
        }
    };

    return (
        <>
            <h3>Add Expense Details</h3>
            {isLoading && <h3>Loading...!</h3>}
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={AddExpenseValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, isValid, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit} enctype="multipart/form-data">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Expense Details </InputLabel>
                                    <OutlinedInput
                                        id="details"
                                        name="details"
                                        type="text"
                                        value={values.details}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Details"
                                        inputProps={{ min: 1 }}
                                    />
                                    {errors.details && (
                                        <FormHelperText error id="standard-weight-helper-text-sale-rate">
                                            {errors.details}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Select Payment Method </InputLabel>
                                    <Select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        type="text"
                                        value={values.paymentMethod}
                                        onBlur={handleBlur}
                                        onChange={(event) => handlePaymentMethod(event, setFieldValue)}
                                        label="Select Payment Method"
                                        sx={{ paddingTop: '15px' }}
                                    >
                                        {PAYMENT_METHODS.map(
                                            (item) => item.key !== 'pending' && <MenuItem value={item.key}>{item.value}</MenuItem>
                                        )}
                                    </Select>
                                    {errors.paymentMethod && (
                                        <FormHelperText error id="standard-weight-helper-text-paymentMethod">
                                            {errors.paymentMethod}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> {values.paymentMethod === 'cheque' ? <>Cheque #</> : <>TID</>} </InputLabel>
                                    <OutlinedInput
                                        id="tid"
                                        name="tid"
                                        type="text"
                                        value={values.tid}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label={values.paymentMethod === 'cheque' ? 'Cheque #' : 'TID'}
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
                                        sx={{ paddingTop: '5px' }}
                                    />
                                    {errors.amount && (
                                        <FormHelperText error id="standard-weight-helper-text-amount">
                                            {errors.amount}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Spent By </InputLabel>
                                    <Select
                                        id="spentBy"
                                        name="spentBy"
                                        type="text"
                                        value={values.spentBy}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Spent By"
                                        sx={{ paddingTop: '15px' }}
                                    >
                                        <MenuItem value="company">Company</MenuItem>
                                        {partners.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.fullname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.spentBy && (
                                        <FormHelperText error id="standard-weight-helper-text-spentBy">
                                            {errors.spentBy}
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
                                        inputProps={{ max: moment(new Date()).format('YYYY-MM-DD') }}
                                    />
                                    {errors.date && (
                                        <FormHelperText error id="standard-weight-helper-text-date">
                                            {errors.date}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Picture </InputLabel>
                                    <OutlinedInput
                                        id="image"
                                        name="image"
                                        type="file"
                                        onChange={(event) => {
                                            setFieldValue('image', event.currentTarget.files[0] || null);
                                        }}
                                        label="Picture"
                                        sx={{ paddingTop: '10px' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid} title="Add Expense" />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default AddExpense;
