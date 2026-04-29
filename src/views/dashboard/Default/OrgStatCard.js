import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import useOrgTheme from 'utils/useOrgTheme';

const CardWrapper = styled(MainCard, {
    shouldForwardProp: (prop) => prop !== 'primaryColor'
})(({ primaryColor }) => ({
    backgroundColor: `${primaryColor} !important`,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, rgba(255,255,255,0.2) -50.94%, rgba(255,255,255,0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, rgba(255,255,255,0.15) -14.02%, rgba(255,255,255,0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const OrgStatCard = ({ isLoading, total, title }) => {
    const theme = useTheme();
    const { primaryColor, secondaryColor } = useOrgTheme();

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false} primaryColor={primaryColor}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: `${secondaryColor} !important`,
                                            color: '#fff'
                                        }}
                                    >
                                        <TableChartOutlinedIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <Box sx={{ py: 0, mt: 0.45, mb: 0.45 }}>
                                    <Typography variant="h2" sx={{ color: '#fff' }}>
                                        {total}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1.5 }}>
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

OrgStatCard.propTypes = {
    isLoading: PropTypes.bool,
    total: PropTypes.number,
    title: PropTypes.string
};

export default OrgStatCard;