import { useEffect } from 'react';
import jwt from 'jwtservice/jwtService';

const AuthRedirect = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const refreshToken = params.get('refreshToken');
        const userStr = params.get('user');

        if (token && refreshToken && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

               
                localStorage.removeItem('org_colors');
                localStorage.removeItem('org_branding');

                jwt.setToken(token);
                jwt.setRefreshToken(refreshToken);
                jwt.setUser({ ...user, time: Date.now() });
                jwt.setIsLogin(true);

                // Dashboard pe bhejo
                window.location.replace('/dashboard');
            } catch (e) {
                window.location.replace('/login');
            }
        } else {
            window.location.replace('/login');
        }
    }, []);

    return <div>Redirecting...</div>;
};

export default AuthRedirect;