import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import Routes from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import useAppContext from 'context/useAppContext';

const App = () => {
    const customization = useSelector((state) => state.customization);
    const { orgColors } = useAppContext();

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization, orgColors)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;