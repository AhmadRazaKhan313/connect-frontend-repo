import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, Typography } from '@mui/material';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import numeral from 'numeral';
import numberToWords from 'number-to-words';
import { capitalize } from 'utils/Functions';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: 'rgba(255,255,255,0.12)',
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

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
                                            backgroundColor: 'rgba(255,255,255,0.2) !important',
                                            color: '#fff'
                                        }}
                                    >
                                        <TableChartOutlinedIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <Box sx={{ py: 0, mt: 0.45, mb: 0.45 }}>
                                    <Typography variant="h2" sx={{ color: '#fff' }}>
                                        Rs. {numeral(total).format('0,0')}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.75)', mt: 1.5 }}>
                                        {capitalize(numberToWords.toWords(total))}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
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
    isLoading: PropTypes.bool,
    total: PropTypes.number,
    title: PropTypes.string
};

export default TotalIncomeDarkCard;
