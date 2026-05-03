import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

// material-ui
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// project imports
import NavItem from '../NavItem';

const NavCollapse = ({ menu, level }) => {
    const customization = useSelector((state) => state.customization);
    const theme = useTheme();
    const primary = theme.palette.primary.main;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);
    };

    const { pathname } = useLocation();

    const checkOpenForParent = (child, id) => {
        child.forEach((item) => {
            if (item.url === pathname) {
                setOpen(true);
                setSelected(id);
            }
        });
    };

    useEffect(() => {
        setOpen(false);
        setSelected(null);
        if (menu.children) {
            menu.children.forEach((item) => {
                if (item.children?.length) {
                    checkOpenForParent(item.children, menu.id);
                }
                if (item.url === pathname) {
                    setSelected(menu.id);
                    setOpen(true);
                }
            });
        }
        // eslint-disable-next-line
    }, [pathname, menu.children]);

    const menus = menu.children?.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} />;
            case 'item':
                return <NavItem key={item.id} item={item} level={level + 1} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const Icon = menu.icon;
    const isSelected = selected === menu.id;

    const menuIcon = menu.icon ? (
        <Icon sx={{ fontSize: '1.2rem' }} />
    ) : (
        <FiberManualRecordIcon
            sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    alignItems: 'center',
                    py: level > 1 ? 0.75 : 1,
                    pl: `${level > 1 ? level * 20 : 12}px`,
                    pr: '12px',
                    backgroundColor: isSelected ? `${primary}14` : 'transparent',
                    color: isSelected ? primary : 'text.secondary',
                    '&:hover': {
                        backgroundColor: `${primary}12`,
                        color: primary,
                        '& .MuiListItemIcon-root': { color: primary }
                    }
                }}
                selected={isSelected}
                onClick={handleClick}
            >
                <ListItemIcon
                    sx={{
                        my: 'auto',
                        minWidth: !menu.icon ? 24 : 34,
                        color: isSelected ? primary : 'text.secondary'
                    }}
                >
                    {menuIcon}
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: isSelected ? 600 : 400,
                                fontSize: '0.875rem',
                                color: isSelected ? primary : 'inherit'
                            }}
                        >
                            {menu.title}
                        </Typography>
                    }
                />
                {open ? (
                    <ExpandLessIcon sx={{ fontSize: '1rem', color: isSelected ? primary : 'text.secondary' }} />
                ) : (
                    <ExpandMoreIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                )}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        position: 'relative',
                        pl: 1,
                        '&:before': {
                            content: "''",
                            position: 'absolute',
                            left: '28px',
                            top: 0,
                            height: '100%',
                            width: '1px',
                            background: `${primary}30`
                        }
                    }}
                >
                    {menus}
                </List>
            </Collapse>
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number
};

export default NavCollapse;
