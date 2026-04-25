import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonIspGrandSummaryCard from 'ui-component/cards/Skeleton/IspGrandSummaryCard';
import useOrgTheme from 'utils/useOrgTheme';

// ===========================|| DASHBOARD DEFAULT - PARTNER SUMMARY CARD ||=========================== //

const PartnerGrandSummaryCard = ({ isLoading, data, companyIncome }) => {
    const { primaryColor } = useOrgTheme();

    const partnerProfit = +(data?.share / 100) * +companyIncome;
    const partnerExpense = +data?.expense;

    const cardItem = { zIndex: 10 };
    const numberStyle = { fontSize: 24, fontWeight: 'bold' };
    const numberStyleRemaining = { fontSize: 30, fontWeight: 'bold', color: 'red' };
    const nameStyle = { fontSize: 27, fontWeight: 'bold' };
    const textStyle = { fontSize: 18 };
    const textStyleRemaining = { fontSize: 22, color: 'red' };

    const CardWrapper = styled(MainCard)(({ theme }) => ({
        backgroundColor: primaryColor,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        myItem: { zIndex: 999 },
        '&:after': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
            borderRadius: '50%',
            top: -30,
            right: -180
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
            borderRadius: '50%',
            top: -160,
            right: -130
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
                            <Typography sx={nameStyle}>{data?.fullname}</Typography>
                        </Grid>
                        <Grid container sx={{ mt: 1.5 }}>
                            <Grid item sx={cardItem} xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{+(partnerProfit).toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Profit</Typography>
                                </Grid>
                            </Grid>
                            <Grid item sx={cardItem} xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyle}>{(partnerExpense).toFixed(0)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyle}>Expense</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ mt: 1.5 }}>
                            <Grid item sx={cardItem} xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={numberStyleRemaining}>{+(partnerProfit - partnerExpense).toFixed(0)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography style={textStyleRemaining}>Remaining</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

PartnerGrandSummaryCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PartnerGrandSummaryCard;