import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Button, Grid, MenuItem, Select } from '@mui/material';
import useOrgTheme from 'utils/useOrgTheme';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';
import moment from 'moment';
import { getPaymentMethodNameByKey } from 'utils/Functions';
import { useNavigate } from 'react-router';
import useAppContext from 'context/useAppContext';
import AnimateButton from 'ui-component/extended/AnimateButton';

function createData(isp, entryDate, userId, mobile, packageName, paymentMethod, saleRate, expiryDate, user, action) {
    return { isp, entryDate, userId, mobile, packageName, paymentMethod, saleRate, expiryDate, user, action };
}

export default function PendingEntries() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const [selectedYear, setSelectedYear] = useState('0');
    const [selectedMonth, setSelectedMonth] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data, setData, filteredData, setFilteredData, setFilters } = useAppContext();

    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);

  const { tableHeaderStyle: style, primaryColor } = useOrgTheme();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setFilters(['isp', 'entryDate', 'userId', 'packageName', 'paymentMethod', 'saleRate', 'expiryDate', 'mobile']);
        getEntry();
    }, []);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    useEffect(() => {
        if (!selectedMonth || selectedMonth === '' || selectedMonth === '0') {
            setIsError(true);
            setErrorMessage('Please select a month');
        } else if (!selectedYear || selectedYear === '' || selectedYear === '0') {
            setIsError(true);
            setErrorMessage('Please select a year');
        } else if (selectedMonth && selectedYear) {
            getEntriesWithinDateRange(selectedMonth, selectedYear);
        }
    }, [selectedMonth, selectedYear]);

    const getEntry = () => {
        setSelectedMonth('0');
        setSelectedYear('0');
        setIsLoading(true);
        jwt.getAllPendingEntries()
            .then((res) => {
                let rowsData = [];
                res?.data?.map((item) =>
                    rowsData.push(
                        createData(
                            item?.isp?.name,
                            moment(item?.entryDate).format('DD/MM/YYYY'),
                            item?.userId,
                            item?.user?.mobile,
                            item?.package?.name,
                            getPaymentMethodNameByKey(item?.paymentMethod),
                            item?.package?.saleRate,
                            moment(item?.expiryDate).format('DD/MM/YYYY'),
                            item?.user,
                            <CompletePaymentButton id={item?.id || item?._id} />
                        )
                    )
                );
                setData(rowsData);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const getEntriesWithinDateRange = (month, year) => {
        setIsLoading(true);
        jwt.getAllPendingEntriesWithinDateRange({ month, year })
            .then((res) => {
                let rowsData = [];
                res?.data?.map((item) =>
                    rowsData.push(
                        createData(
                            item?.isp?.name,
                            moment(item?.entryDate).format('DD/MM/YYYY'),
                            item?.userId,
                            item?.user?.mobile,
                            item?.package?.name,
                            getPaymentMethodNameByKey(item?.paymentMethod),
                            item?.package?.saleRate,
                            moment(item?.expiryDate).format('DD/MM/YYYY'),
                            item?.user,
                            <CompletePaymentButton id={item?.id || item?._id} />
                        )
                    )
                );
                setData(rowsData);
                setIsLoading(false);
                setIsError(false);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
                setIsError(true);
                setIsLoading(false);
            });
    };

    const completePayment = (id) => {
        navigate(`/dashboard/complete-payment/${id}`);
    };

    const CompletePaymentButton = ({ id }) => {
        return (
            <Button variant="contained" color="warning" onClick={() => completePayment(id)}>
                Pay
            </Button>
        );
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item sm={12} xs={12} md={4} lg={4} xl={4}>
                    <Select
                        fullWidth
                        sx={{ height: '100%' }}
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(event.target.value)}
                    >
                        <MenuItem value="0">Select Month</MenuItem>
                        <MenuItem value="1">January</MenuItem>
                        <MenuItem value="2">February</MenuItem>
                        <MenuItem value="3">March</MenuItem>
                        <MenuItem value="4">April</MenuItem>
                        <MenuItem value="5">May</MenuItem>
                        <MenuItem value="6">June</MenuItem>
                        <MenuItem value="7">July</MenuItem>
                        <MenuItem value="8">August</MenuItem>
                        <MenuItem value="9">September</MenuItem>
                        <MenuItem value="10">Ocotber</MenuItem>
                        <MenuItem value="11">November</MenuItem>
                        <MenuItem value="12">December</MenuItem>
                    </Select>
                </Grid>
                <Grid item sm={12} xs={12} md={4} lg={4} xl={4}>
                    <Select
                        fullWidth
                        sx={{ height: '100%' }}
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(event.target.value)}
                    >
                        <MenuItem value="0">Select Year</MenuItem>
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item sm={12} xs={12} md={4} lg={4} xl={4}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={getEntry}
                            style={{ backgroundColor: primaryColor, color: 'white', height: '55px', borderRadius: '10px' }}
                        >
                            All Pending Entries
                        </Button>
                    </AnimateButton>
                </Grid>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
                {isLoading && <h3>Loading...!</h3>}
                {isError ? (
                    <Alert severity="error">{errorMessage}</Alert>
                ) : (
                    !isLoading && (
                        <>
                            <TableContainer sx={{ maxHeight: 'auto' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={style}>Sr.</TableCell>
                                            <TableCell style={style}>Date</TableCell>
                                            <TableCell style={style}>ISP</TableCell>
                                            <TableCell style={style}>User Id</TableCell>
                                            <TableCell style={style}>Mobile</TableCell>
                                            <TableCell style={style}>Package</TableCell>
                                            <TableCell style={style}>Payment Method</TableCell>
                                            <TableCell style={style}>Amount</TableCell>
                                            <TableCell style={style}>Expiry Date</TableCell>
                                            <TableCell style={style}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{row?.entryDate}</TableCell>
                                                    <TableCell>{row?.isp}</TableCell>
                                                    <TableCell>{row?.userId}</TableCell>
                                                    <TableCell>{row?.user?.mobile}</TableCell>
                                                    <TableCell>{row?.packageName}</TableCell>
                                                    <TableCell>{row?.paymentMethod}</TableCell>
                                                    <TableCell>{row?.saleRate}</TableCell>
                                                    <TableCell>{row?.expiryDate}</TableCell>
                                                    <TableCell>{row?.action}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[500, 1000]}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )
                )}
            </Paper>
        </>
    );
}
