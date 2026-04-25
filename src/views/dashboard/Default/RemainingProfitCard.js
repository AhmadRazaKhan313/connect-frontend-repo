import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import numeral from 'numeral';
import numberToWords from 'number-to-words';
import { capitalize } from 'utils/Functions';

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const RemainingProfitCard = ({ isLoading, total, title = 'Total Income', color = 'red' }) => {
    const CardWrapper = styled(MainCard)(({ theme }) => ({
        backgroundColor: color,
        color: theme.palette.primary.light,
        overflow: 'hidden',
        position: 'relative',
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
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box
                        sx={{
                            py: 2,
                            mt: 0.5,
                            mb: 0.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h1" sx={{ color: '#fff' }}>
                            Rs. {numeral(total).format('0,0')}
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#fff', textAlign: 'center', mt: 1.25 }}>
                            {capitalize(numberToWords.toWords(+total))}
                        </Typography>
                        <Typography variant="h3" sx={{ color: 'primary.light', mt: 1.25 }}>
                            {title}
                        </Typography>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

RemainingProfitCard.propTypes = {
    isLoading: PropTypes.bool
};

export default RemainingProfitCard;
