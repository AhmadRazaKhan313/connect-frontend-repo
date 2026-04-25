import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { THEME_COLOR_DARK } from 'utils/Constants';
import numeral from 'numeral';
import numberToWords from 'number-to-words';
import { capitalize } from 'utils/Functions';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: `${theme.palette.primary.dark} !important`,
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

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalIncomeDarkCard = ({ isLoading, total, title = 'Total Income' }) => {
    const theme = useTheme();
    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: `${theme.palette.primary[800]} !important`,
                                            color: '#fff'
                                        }}
                                    >
                                        <TableChartOutlinedIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <Box
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                >
                                    <Typography variant="h2" sx={{ color: '#fff' }}>
                                        Rs. {numeral(total).format('0,0')}
                                    </Typography>{' '}
                                    <Typography variant="subtitle1" sx={{ color: 'primary.light', mt: 1.5 }}>
                                        {capitalize(numberToWords.toWords(total))}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'primary.light', mt: 1.5 }}>
                                        {title}
                                    </Typography>
                                </Box>
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TotalIncomeDarkCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalIncomeDarkCard;
