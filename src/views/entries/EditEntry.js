import { Alert, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Field, Formik } from 'formik';
import jwt from 'jwtservice/jwtService';
import moment from 'moment';
import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import SimpleButton from 'ui-component/SimpleButton';
import { PAYMENT_METHODS } from 'utils/Constants';
import useOrgTheme from 'utils/useOrgTheme';
import { CreateEntryValidationSchema } from '../../utils/ValidationSchemas';
import ModalReceipt from './ModalReceipt';
import Receipt from './Receipt';

function EditEntry() {
    const theme = useTheme();
    const startDateRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const entryId = state?.data?.id || state?.data?._id;

    const [isps, setIsps] = useState([]);
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState({});

    const { primaryColor } = useOrgTheme();

    const handleCloseModal = () => {
        setOpenModal(false);
        // navigate('/dashboard/all-entries');
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'User Invoice',
        pageStyle: `@media print { @page { size: A5; margin-top: 0; }, .header, .footer, .letterhead { display: none } }`,
        copyStyles: true,
        scale: 0.8,
        onAfterPrint: () => {
            handleCloseModal();
        },
        onPrintError: () => {
            handleCloseModal();
        },
        onError: () => {
            handleCloseModal();
        }
    });

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

    let initialValues = {
        entryDate: moment(state?.data?.entryDate).format('YYYY-MM-DD'),
        isp: state?.data?.isp?.id,
        userId: state?.data?.userId,
        package: state?.data?.package?.id,
        paymentMethod: state?.data?.paymentMethod,
        tid: state?.data?.tid,
        ipType: state?.data?.ipType,
        staticIp: state?.data?.staticIp,
        staticIpSaleRate: state?.data?.staticIpSaleRate,
        saleRate: state?.data?.saleRate,
        startDate: moment(state?.data?.startDate).format('YYYY-MM-DD'),
        expiryDate: moment(state?.data?.expiryDate).format('YYYY-MM-DD')
    };

    useEffect(() => {
        getPackages(initialValues.isp);
    }, [initialValues.isp]);

    const onSubmit = (values, { resetForm }) => {
        setIsLoading(true);
        jwt.updateEntry(entryId, values)
            .then((res) => {
                setIsLoading(false);
                setIsError(false);
                alert('Entry Updated');
                navigate('/dashboard/all-entries');
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
        getPackages(ispId);
    };

    const handlePaymentMethodChange = (event, setFieldValue) => {
        const paymentMethod = event.target.value;
        setFieldValue('paymentMethod', paymentMethod);
        if (paymentMethod === 'net' || paymentMethod === 'pending') {
            setFieldValue('tid', '');
            setFieldValue('paymentMethod', paymentMethod);
        }
        if (paymentMethod === 'pending') {
            setFieldValue('saleRate', 0);
            setFieldValue('paymentMethod', paymentMethod);
        }
    };

    const handleStartDate = (event, setFieldValue) => {
        const givenDate = new Date(event.target.value);
        const oneMonthLaterDate = new Date(givenDate.getFullYear(), givenDate.getMonth() + 1, givenDate.getDate());
        setFieldValue('startDate', event.target.value);
        setFieldValue('expiryDate', moment(oneMonthLaterDate).format('YYYY-MM-DD'));
        setTimeout(() => {
            startDateRef.current.blur();
        }, 1);
    };

    const getPackages = (isp) => {
        setIsLoading(true);
        jwt.getAllPackages(isp)
            .then((res) => {
                setPackages(res?.data);
                setColorBg(res?.data[0]?.isp?.color);
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
            <h3>Edit Entry Details</h3>
            {isLoading && <h3>Loading...!</h3>}
            {isError && <Alert severity="error">{errorMessage}</Alert>}
            <Formik initialValues={initialValues} validationSchema={CreateEntryValidationSchema} onSubmit={onSubmit}>
                {({ values, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Entry Date </InputLabel>
                                    <OutlinedInput
                                        id="entryDate"
                                        name="entryDate"
                                        type="date"
                                        value={values.entryDate}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Entry Date"
                                        sx={{ paddingTop: '10px' }}
                                        inputProps={{ max: moment(new Date()).format('YYYY-MM-DD') }}
                                    />
                                    {errors.entryDate && (
                                        <FormHelperText error id="standard-weight-helper-text-entryDate">
                                            {errors.entryDate}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
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
                                        sx={{ paddingTop: '20px' }}
                                    >
                                        {isps.map((isp) => (
                                            <MenuItem value={isp.id}>{isp.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.isp && (
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {errors.isp}
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
                                    <InputLabel> Select Package </InputLabel>
                                    <Select
                                        id="package"
                                        name="package"
                                        type="text"
                                        value={values.package}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Select Package"
                                        sx={{ paddingTop: '15px' }}
                                    >
                                        {packages.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.package && (
                                        <FormHelperText error id="standard-weight-helper-text-package">
                                            {errors.package}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
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
                                            <MenuItem value={item.key}>{item.value}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.paymentMethod && (
                                        <FormHelperText error id="standard-weight-helper-text-paymentMethod">
                                            {errors.paymentMethod}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
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
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Sale Rate </InputLabel>
                                    <OutlinedInput
                                        id="saleRate"
                                        name="saleRate"
                                        type="number"
                                        value={values.saleRate}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Sale Rate"
                                        inputProps={{ min: 1 }}
                                        sx={{ paddingTop: '5px' }}
                                        disabled={values.paymentMethod === 'pending'}
                                    />
                                    {errors.saleRate && (
                                        <FormHelperText error id="standard-weight-helper-text-sale-rate">
                                            {errors.saleRate}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> IP Type </InputLabel>
                                    <Select
                                        id="ipType"
                                        name="ipType"
                                        type="text"
                                        value={values.ipType}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="IP Type"
                                        sx={{ paddingTop: '15px' }}
                                    >
                                        <MenuItem value="dynamic">Dynamic</MenuItem>
                                        <MenuItem value="static">Static</MenuItem>
                                    </Select>
                                    {errors.ipType && (
                                        <FormHelperText error id="standard-weight-helper-ipType">
                                            {errors.ipType}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Static Ip </InputLabel>
                                    <OutlinedInput
                                        id="staticIp"
                                        name="staticIp"
                                        type="text"
                                        value={values.staticIp}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Static Ip"
                                        disabled={values.ipType === 'dynamic'}
                                        required={values.ipType !== 'dynamic'}
                                    />
                                    {errors.staticIp && (
                                        <FormHelperText error id="standard-weight-helper-text-staticIp">
                                            {errors.staticIp}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Static Ip Sale Rate </InputLabel>
                                    <OutlinedInput
                                        id="staticIpSaleRate"
                                        name="staticIpSaleRate"
                                        type="number"
                                        value={values.staticIpSaleRate}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Static Ip"
                                        inputProps={{ min: 0 }}
                                        disabled={values.ipType === 'dynamic'}
                                        required={values.ipType !== 'dynamic'}
                                    />
                                    {errors.staticIpSaleRate && (
                                        <FormHelperText error id="standard-weight-helper-text-staticIpSaleRate">
                                            {errors.staticIpSaleRate}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Start Date </InputLabel>
                                    <OutlinedInput
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={values.startDate}
                                        onBlur={handleBlur}
                                        onChange={(e) => handleStartDate(e, setFieldValue)}
                                        label="Expriy Date"
                                        sx={{ paddingTop: '10px' }}
                                        inputRef={startDateRef}
                                    />
                                    {errors.startDate && (
                                        <FormHelperText error id="standard-weight-helper-text-startDate">
                                            {errors.startDate}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                    <InputLabel> Expiry Date </InputLabel>
                                    <OutlinedInput
                                        id="expiryDate"
                                        name="expiryDate"
                                        type="date"
                                        value={values.expiryDate}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Expriy Date"
                                        sx={{ paddingTop: '10px' }}
                                    />
                                    {errors.expiryDate && (
                                        <FormHelperText error id="standard-weight-helper-text-expiryDate">
                                            {errors.expiryDate}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        {/* <label htmlFor="sendAlertMessage">
                            <Field id="sendAlertMessage" name="sendAlertMessage" type="checkbox" checked={values.sendAlertMessage} />
                            Send SMS Alert
                        </label> */}
                        <Box sx={{ mt: 2 }}>
                            <Grid sx={{ width: '100%' }}>
                                <SimpleButton isValid={!isValid} title="Edit Entry" color={colorBg} />
                            </Grid>
                        </Box>
                        <ModalReceipt
                            open={openModal}
                            title="Print Receipt"
                            message="Do you want to print the receipt ?"
                            handleClose={handleCloseModal}
                            action={handlePrint}
                        />
                        <Grid sx={{ mt: 2, display: 'none' }}>
                            <Receipt ref={componentRef} data={data} />
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default EditEntry;
