import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import jwt from 'jwtservice/jwtService';
import { Navigate } from 'react-router';
import ApiConnectionError from 'views/error/ApiConnectionError';

const LandingPage = Loadable(lazy(() => import('views/landing-page')));
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication/Login')));
const AuthRedirect = Loadable(lazy(() => import('views/pages/authentication/authentication/AuthRedirect')));
const Setup = Loadable(lazy(() => import('views/pages/authentication/authentication/Setup')));
const NotFound = Loadable(lazy(() => import('views/error/NotFound')));


// ==============================|| AUTHENTICATION ROUTING ||============================== //

const checkLogin = (element) => {
    const hostname = window.location.hostname;

    if (hostname === 'localhost') {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('connect_last_subdomain');
        return element;
    }

    const isLogin = jwt.getIsLogin();
    if (isLogin !== true) return element;
    return <Navigate to="/dashboard" replace={true} />;
};
// const checkLogin = (element) => {
//     const hostname = window.location.hostname;

//     if (hostname === 'localhost') {
//         return element; // bas landing page dikhao
//     }

//     const isLogin = jwt.getIsLogin();
//     if (isLogin !== true) return element;
//     return <Navigate to="/dashboard" replace={true} />;
// };

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        { path: '/', element: checkLogin(<LandingPage />) },
        { path: '/login', element: checkLogin(<AuthLogin />) },
        { path: '/auth-redirect', element: <AuthRedirect /> },
        { path: '/setup', element: <Setup /> },
        { path: '/api-error', element: <ApiConnectionError /> },
        { path: '*', element: <NotFound /> }
    ]
};

export default AuthenticationRoutes;
