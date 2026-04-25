import { Button } from '@mui/material';
import AnimateButton from './extended/AnimateButton';
import useOrgTheme from 'utils/useOrgTheme';

function SimpleButton({ isValid, title, color }) {
    const { primaryColor } = useOrgTheme();
    const btnColor = color || primaryColor;

    return (
        <AnimateButton>
            <Button
                disableElevation
                disabled={isValid}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                style={{ backgroundColor: btnColor, color: 'white' }}
            >
                {title}
            </Button>
        </AnimateButton>
    );
}

export default SimpleButton;
