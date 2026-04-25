import { forwardRef } from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import jwt from 'jwtservice/jwtService';

const useStyles = makeStyles({
    tableCell: {
        border: '1px solid black !important',
        padding: '10px'
    },
    tableCellBlack: {
        border: '1px solid black !important',
        padding: '10px',
        backgroundColor: 'black',
        color: 'white'
    },
    tableCellNoBorder1: {
        borderTop: '1px solid black !important',
        borderBottom: '1px solid black !important',
        borderLeft: '1px solid black !important',
        padding: '10px'
    },
    tableCellNoBorder2: {
        borderTop: '1px solid black !important',
        borderBottom: '1px solid black !important',
        borderRight: '1px solid black !important',
        padding: '10px'
    },
    typography: {
        // padding: '0px'
    }
});

const Receipt = forwardRef(({ data = {} }, ref) => {
    const classes = useStyles();
    return (
        <div ref={ref}>
            <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
                {moment(new Date()).format('DD/MM/YYYY hh:mm A')}
            </Typography>
            <TableContainer component={Paper} sx={{ border: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableCell} colSpan={4} variant="head" align="center">
                                <Typography variant="h1">Invoice</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>User Id</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCell}>
                                <Typography className={classes.typography}>{data?.user?.userId}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCellNoBorder1}>
                                <Typography className={classes.typography}>VLAN ID</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCellNoBorder2}>
                                <Typography className={classes.typography}>{data?.isp?.vlan}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>Contact Number</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCell}>
                                <Typography className={classes.typography}>{data?.user?.mobile}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCellNoBorder1}>
                                <Typography className={classes.typography}>Address</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCellNoBorder2}>
                                <Typography className={classes.typography}>{data?.user?.address}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>Bandwidth</Typography>
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>{data?.package?.bandwidth} Mb</Typography>
                            </TableCell>
                            <TableCell colSpan={2} className={classes.tableCell}>
                                <Typography className={classes.typography}>{data?.saleRate}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>Static IP</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCell}>
                                <Typography className={classes.typography}>{data?.staticIp}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} className={classes.tableCell}>
                                <Typography className={classes.typography}>Renewal Date</Typography>
                            </TableCell>
                            <TableCell colSpan={2} className={classes.tableCell}>
                                <Typography className={classes.typography}>Expiry Date</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} className={classes.tableCellBlack}>
                                <Typography className={classes.typography}>{moment(data?.startDate).format('DD/MM/YYYY')}</Typography>
                            </TableCell>
                            <TableCell colSpan={2} className={classes.tableCellBlack}>
                                <Typography className={classes.typography}>
                                    {moment(data?.expiryDate).format('DD/MM/YYYY')} 12:00 PM
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>Total Amount</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCell}>
                                <Typography className={classes.typography}>{data?.saleRate}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCellNoBorder1}>
                                <Typography className={classes.typography}>Slip By</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCellNoBorder2}>
                                <Typography className={classes.typography}>
                                    {jwt.getUser()?.fullname} {jwt.getUser()?.mobile}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>For Online Payment</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCell}>
                                <Typography className={classes.typography}>Meezan Bank</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableCell}>
                                <Typography className={classes.typography}>6001-010-5688077</Typography>
                            </TableCell>
                            <TableCell colSpan={3} className={classes.tableCell}>
                                <Typography className={classes.typography}>Connect Communications Lodhran</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography className={classes.typography}>
                                    <span style={{ fontFamily: 'Times New Roman' }}>Office Helpline:</span>_Bilal Farooq 0334-9000873
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </div>
    );
});

export default Receipt;
