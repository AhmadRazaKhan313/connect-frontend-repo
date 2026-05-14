import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';

const NavItem = ({ item, level }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

    const Icon = item.icon;
    const isSelected = customization.isOpen.findIndex((id) => id === item?.id) > -1;

    const primary = theme.palette.primary.main;

    const itemIcon = item?.icon ? (
        <Icon sx={{ fontSize: '1.2rem' }} />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: isSelected ? 8 : 6,
                height: isSelected ? 8 : 6,
                color: isSelected ? '#fff' : '#333'
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    let itemTarget = '_self';
    if (item.target) itemTarget = '_blank';

    let listItemProps = {
        component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
    };
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    const itemHandler = (id) => {
        dispatch({ type: MENU_OPEN, id });
        if (matchesSM) dispatch({ type: SET_MENU, opened: false });
    };

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: item.id });
        }
        // eslint-disable-next-line
    }, []);

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            sx={{
                borderRadius: '8px',
                mb: 0.3,
                alignItems: 'center',
                py: level > 1 ? 0.5 : 0.85,
                pl: level > 1 ? `${level * 20}px` : '12px',
                pr: '12px',
                backgroundColor: isSelected ? `${primary} !important` : 'transparent',
                color: isSelected ? '#fff' : 'text.secondary',
                '&:hover': {
                    backgroundColor: isSelected ? `${primary} !important` : `${primary}12`,
                    color: isSelected ? '#fff' : primary,
                    '& .MuiListItemIcon-root': { color: isSelected ? '#fff' : primary }
                }
            }}
            selected={isSelected}
            onClick={() => itemHandler(item.id)}
        >
            <ListItemIcon
                sx={{
                    my: 'auto',
                    minWidth: !item?.icon ? 24 : 34,
                    color: isSelected ? '#fff' : 'text.secondary'
                }}
            >
                {itemIcon}
            </ListItemIcon>
            <ListItemText
                primary={
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? '#fff' : '#1a1a1a',
                            fontSize: '0.875rem'
                        }}
                    >
                        {item.title}
                    </Typography>
                }
            />
        </ListItemButton>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default NavItem;