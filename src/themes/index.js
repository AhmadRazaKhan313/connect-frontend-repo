import { createTheme } from '@mui/material/styles';

// assets
import colors from 'assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

export const theme = (customization, orgColors = {}) => {
    const color = colors;

    // Org colors — default blue (DashStack style), NOT orange
    const primaryColor = orgColors?.primaryColor || '#4361ee';
    const secondaryColor = orgColors?.secondaryColor || '#424242';

    const hexToRgba = (hex, alpha) => {
        if (!hex || hex.length < 7) return `rgba(67,97,238,${alpha})`;
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
            secondaryDark: secondaryColor
        },
        heading: color.grey900,
        background: color.paper,
        backgroundDefault: color.paper,
        paper: color.paper,
        darkTextPrimary: color.grey700,
        darkTextSecondary: color.grey500,
        textDark: color.grey900,
        menuSelected: primaryColor,
        menuSelectedBack: hexToRgba(primaryColor, 0.10),
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
                '@media (min-width: 600px)': { minHeight: '48px' }
            }
        },
        typography: themeTypography(themeOption)
    };

    const themes = createTheme(themeOptions);
    themes.components = componentStyleOverrides(themeOption);
    return themes;
};

export default theme;
