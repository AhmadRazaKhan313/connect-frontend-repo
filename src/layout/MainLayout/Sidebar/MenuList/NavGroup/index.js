import PropTypes from 'prop-types';

// material-ui
import { Divider, List, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';

const NavGroup = ({ item }) => {
    const items = item.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} />;
            case 'item':
                return <NavItem key={menu.id} item={menu} level={1} />;
            default:
                return (
                    <Typography key={menu.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return (
        <>
            {item.title && (
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'text.disabled',
                        px: 1.5,
                        pt: 1.5,
                        pb: 0.5
                    }}
                >
                    {item.title}
                </Typography>
            )}
            <List disablePadding>{items}</List>
            <Divider sx={{ mt: 0.25, mb: 0.5, borderColor: 'rgba(0,0,0,0.06)' }} />
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;