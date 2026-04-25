import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonIspGrandSummaryCard from 'ui-component/cards/Skeleton/IspGrandSummaryCard';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const IspGrandSummaryCard = ({ isLoading, data }) => {
    const cardItem = { zIndex: 10 };
    const numberStyle = { fontSize: 24, fontWeight: 'bold' };
    const nameStyle = { fontSize: 28, fontWeight: 'bold' };
    const textStyle = { fontSize: 18 };

    const CardWrapper = styled(MainCard)(({ theme }) => ({
        backgroundColor: data?.isp?.color,
        // backgroundColor: 'black',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        myItem: {
            zIndex: 999
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: '#e1e0de',
            borderRadius: '50%',
            top: -140,
            right: -130,
            [theme.breakpoints.down('sm')]: {
                top: -105,
                right: -140
            }
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: data?.isp?.color,
            borderRadius: '50%',
            top: -155,
            right: -70,
            opacity: 0.5,
            [theme.breakpoints.down('sm')]: {
                top: -155,
                right: -70
            }
        }
    }));

    return (
        <>
            {isLoading ? (
                <SkeletonIspGrandSummaryCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid item xs={12}>
                            <Typography sx={nameStyle}>{data?.isp?.name}</Typography>
                        </Grid>
                        <Grid container sx={{ mt: 1.5 }}>
                            <Grid item sx={cardItem} xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{(+data?.totalIncome).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Total Income</Typography>
                                </Grid>
                            </Grid>
                            <Grid item sx={cardItem} xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{(+data?.totalInvoice).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Total Invoice</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ mt: 1.5 }}>
                            <Grid item sx={cardItem} xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{(+data?.totalProfit).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Total Profit</Typography>
                                </Grid>
                            </Grid>
                            <Grid item sx={cardItem} xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{(+data?.totalInvoiceSent).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Invoice Sent</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ mt: 1.5 }}>
                            <Grid item sx={cardItem} xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{(+data?.totalBalance).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Total Balance</Typography>
                                </Grid>
                            </Grid>
                            <Grid item sx={cardItem} xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{(+data?.totalEntryPending).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Total Pending</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

IspGrandSummaryCard.propTypes = {
    isLoading: PropTypes.bool
};

export default IspGrandSummaryCard;
