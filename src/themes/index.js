import { createTheme } from '@mui/material/styles';

// assets
import colors from 'assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization, orgColors = {}) => {
    const color = colors;
    
    // Organization colors — fallback to default if not set
const primaryColor = orgColors?.primaryColor || '#f07911';
const secondaryColor = orgColors?.secondaryColor || '#424242';

// Convert hex to rgba for opacity
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const themeOption = {
    colors: {
        ...color,
        primaryMain: primaryColor,
        primaryLight: hexToRgba(primaryColor, 0.12),
        primaryDark: primaryColor,
        primary200: hexToRgba(primaryColor, 0.25),
        primary800: primaryColor,
        secondaryMain: secondaryColor,
        secondaryLight: hexToRgba(secondaryColor, 0.12),
        secondaryDark: secondaryColor,
    },
    heading: color.grey900,
    // Background hamesha white rakho
    background: color.paper,
    backgroundDefault: color.paper,
    paper: color.paper,
    darkTextPrimary: color.grey700,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: secondaryColor,
    menuSelectedBack: hexToRgba(secondaryColor, 0.12),
    divider: color.grey200,
    customization
};

    const themeOptions = {
        direction: 'ltr',
        palette: themePalette(themeOption),
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypography(themeOption)
    };

    const themes = createTheme(themeOptions);
    themes.components = componentStyleOverrides(themeOption);
    return themes;
};

export default theme;