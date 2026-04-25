import { Alert, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import moment from 'moment';
import { useState } from 'react';
import SimpleButton from 'ui-component/SimpleButton';
import { PAYMENT_METHODS } from 'utils/Constants';
import useOrgTheme from 'utils/useOrgTheme';
import { CreateExtraIncomeValidationSchema } from '../../utils/ValidationSchemas';
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';

const AddExtraIncome = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const {
        state: { data, action }
    } = location;

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [extraIncomeId, setExtraIncomeId] = useState('');
    const { primaryColor } = useOrgTheme();
    

    useEffect(() => {
        setExtraIncomeId(data?.id || data?._id);
    }, [data]);

    const initialValues = {
        date: moment(data?.date).format('YYYY-MM-DD'),
        category: data?.category,
        userId: data?.userId,
        amount: data?.amount || 0,
        paymentMethod: data?.paymentMethod,
        tid: data?.tid,
        details: data?.details
    };

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        jwt.updateExtraIncome(extraIncomeId, values)
            .then((res) => {
                setIsLoading(false);
                setIsError(false);
                alert('Extra Income Updated');
                if (action === 'edit') navigate('/dashboard/completed-extra-incomes');
                else navigate('/dashboard/pending-extra-incomes');
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const handlePaymentMethodChange = (event, setFieldValue) => {
        const paymentMethod = event.target.value;
        setFieldValue('paymentMethod', paymentMethod);
        if (paymentMethod === 'net' || paymentMethod === 'pending') {
            setFieldValue('tid', '');
            setFieldValue('paymentMethod', paymentMethod);
        }
    };

    return (
        <>
            <h3>Update Entra Income Details</h3>
            {isLoading && <h3>Loading...!</h3>}
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={CreateExtraIncomeValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
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
                                        label="Entry Date"
                                        sx={{ paddingTop: '10px' }}
                                        inputProps={{ max: moment(new Date()).format('YYYY-MM-DD') }}
                                        disabled={action === 'complete'}
                                    />
                                    {errors.date && (
                                        <FormHelperText error id="standard-weight-helper-text-date">
                                            {errors.date}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Select Category </InputLabel>
                                    <Select
                                        id="category"
                                        name="category"
                                        type="text"
                                        value={values.category}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Category"
                                        sx={{ paddingTop: '20px' }}
                                        disabled={action === 'complete'}
                                    >
                                        <MenuItem value="Router">Router</MenuItem>
                                        <MenuItem value="Wire">Wire</MenuItem>
                                        <MenuItem value="Heat Sleeve">Heat Sleeve</MenuItem>
                                        <MenuItem value="Charger">Charger</MenuItem>
                                        <MenuItem value="Ductpatti">Ductpatti</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                    {errors.category && (
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {errors.category}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> User Id </InputLabel>
                                    <OutlinedInput
                                        id="userId"
                                        name="userId"
                                        type="text"
                                        value={values.userId}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="User Id"
                                        inputProps={{ min: 1 }}
                                        sx={{ paddingTop: '5px' }}
                                        disabled={action === 'complete'}
                                    />
                                    {errors.userId && (
                                        <FormHelperText error id="standard-weight-helper-text-userId">
                                            {errors.userId}
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
                                        value={values.amount || 0}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Sale Rate"
                                        inputProps={{ min: 1 }}
                                        sx={{ paddingTop: '5px' }}
                                        disabled={values.paymentMethod === 'pending'}
                                    />
                                    {errors.amount && (
                                        <FormHelperText error id="standard-weight-helper-amount">
                                            {errors.amount}
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
                                        {PAYMENT_METHODS.map((item) => (
                                             <MenuItem key={item.key} value={item.key}>{item.value}</MenuItem>
                                        ))}
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
                                        inputProps={{ min: 1 }}
                                        disabled={values.paymentMethod === 'net' || values.paymentMethod === 'pending'}
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
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Details </InputLabel>
                                    <OutlinedInput
                                        id="details"
                                        name="details"
                                        type="text"
                                        rows={5}
                                        value={values.details}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Expriy Date"
                                        sx={{ paddingTop: '10px' }}
                                        disabled={action === 'complete'}
                                    />
                                    {errors.details && (
                                        <FormHelperText error id="standard-weight-helper-text-details">
                                            {errors.details}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton
                                    isValid={!isValid}
                                    title={action === 'edit' ? 'Edit Extra Income' : 'Complete Extra Income'}
                                    color={colorBg}
                                />
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AddExtraIncome;
