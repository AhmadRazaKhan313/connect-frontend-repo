import useAppContext from 'context/useAppContext';

const useOrgTheme = () => {
    const { orgColors } = useAppContext();
    const primaryColor = orgColors?.primaryColor || '#f07911';
    const secondaryColor = orgColors?.secondaryColor || '#424242';
    
    return {
        primaryColor,
        secondaryColor,
        tableHeaderStyle: { backgroundColor: primaryColor, color: 'white' },
        buttonStyle: { backgroundColor: primaryColor },
    };
};

export default useOrgTheme;