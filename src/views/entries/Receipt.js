import { forwardRef } from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import moment from 'moment';
import jwt from 'jwtservice/jwtService';

// makeStyles v4 se v5 sx prop pe migrate kiya
const cellSx = {
    border: '1px solid black',
    padding: '10px'
};

const cellBlackSx = {
    border: '1px solid black',
    padding: '10px',
    backgroundColor: 'black',
    color: 'white'
};

const cellNoBorder1Sx = {
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    padding: '10px'
};

const cellNoBorder2Sx = {
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
    padding: '10px'
};

const Receipt = forwardRef(({ data = {} }, ref) => {
    return (
        <div ref={ref}>
            <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
                {moment(new Date()).format('DD/MM/YYYY hh:mm A')}
            </Typography>
            <TableContainer component={Paper} sx={{ border: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={cellSx} colSpan={4} variant="head" align="center">
                                <Typography variant="h1">Invoice</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellSx}>
                                <Typography>User Id</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellSx}>
                                <Typography>{data?.user?.userId}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellNoBorder1Sx}>
                                <Typography>VLAN ID</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellNoBorder2Sx}>
                                <Typography>{data?.isp?.vlan}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellSx}>
                                <Typography>Contact Number</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellSx}>
                                <Typography>{data?.user?.mobile}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellNoBorder1Sx}>
                                <Typography>Address</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellNoBorder2Sx}>
                                <Typography>{data?.user?.address}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellSx}>
                                <Typography>Bandwidth</Typography>
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Typography>{data?.package?.bandwidth} Mb</Typography>
                            </TableCell>
                            <TableCell colSpan={2} sx={cellSx}>
                                <Typography>{data?.saleRate}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellSx}>
                                <Typography>Static IP</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellSx}>
                                <Typography>{data?.staticIp}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} sx={cellSx}>
                                <Typography>Renewal Date</Typography>
                            </TableCell>
                            <TableCell colSpan={2} sx={cellSx}>
                                <Typography>Expiry Date</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} sx={cellBlackSx}>
                                <Typography>{moment(data?.startDate).format('DD/MM/YYYY')}</Typography>
                            </TableCell>
                            <TableCell colSpan={2} sx={cellBlackSx}>
                                <Typography>
                                    {moment(data?.expiryDate).format('DD/MM/YYYY')} 12:00 PM
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellSx}>
                                <Typography>Total Amount</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellSx}>
                                <Typography>{data?.saleRate}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellNoBorder1Sx}>
                                <Typography>Slip By</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellNoBorder2Sx}>
                                <Typography>
                                    {jwt.getUser()?.fullname} {jwt.getUser()?.mobile}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellSx}>
                                <Typography>For Online Payment</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellSx}>
                                <Typography>Meezan Bank</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={cellSx}>
                                <Typography>6001-010-5688077</Typography>
                            </TableCell>
                            <TableCell colSpan={3} sx={cellSx}>
                                <Typography>Connect Communications Lodhran</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography>
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