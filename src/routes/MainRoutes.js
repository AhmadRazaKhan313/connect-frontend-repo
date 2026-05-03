import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import jwt from 'jwtservice/jwtService';
import { Navigate } from 'react-router';

const AddOrganization = Loadable(lazy(() => import('views/organization/AddOrganization')));
const AllOrganizations = Loadable(lazy(() => import('views/organization/AllOrganizations')));
const EditOrganization = Loadable(lazy(() => import('views/organization/EditOrganization')));
const MainLayout = Loadable(lazy(() => import('layout/MainLayout')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const AddISP = Loadable(lazy(() => import('views/isps/AddISP')));
const EditISP = Loadable(lazy(() => import('views/isps/EditISP')));
const ViewAllISPs = Loadable(lazy(() => import('views/isps/ViewAllISPs')));
const AddPackage = Loadable(lazy(() => import('views/isps/AddPackage')));
const AllPackages = Loadable(lazy(() => import('views/isps/AllPackages')));
const AddEntry = Loadable(lazy(() => import('views/entries/AddEntry')));
const EditEntry = Loadable(lazy(() => import('views/entries/EditEntry')));
const AllEntries = Loadable(lazy(() => import('views/entries/AllEntries')));
const AddUser = Loadable(lazy(() => import('views/users/AddUser')));
const EditUser = Loadable(lazy(() => import('views/users/EditUser')));
const AllUsers = Loadable(lazy(() => import('views/users/AllUsers')));
const PendingEntries = Loadable(lazy(() => import('views/entries/PendingEntries')));
const AddStaff = Loadable(lazy(() => import('views/staff/AddStaff')));
const AllStaff = Loadable(lazy(() => import('views/staff/AllStaff')));
const CompletePayment = Loadable(lazy(() => import('views/entries/CompletePayment')));
const AllInvoices = Loadable(lazy(() => import('views/invoice/AllInvoices')));
const SentInvoices = Loadable(lazy(() => import('views/invoice/SentInvoices')));
const SendInvoice = Loadable(lazy(() => import('views/invoice/SendInvoice')));
const AddExpense = Loadable(lazy(() => import('views/expense/AddExpense')));
const CompletedExpenses = Loadable(lazy(() => import('views/expense/CompletedExpenses')));
const PendingExpenses = Loadable(lazy(() => import('views/expense/PendingExpenses')));
const EditPackage = Loadable(lazy(() => import('views/isps/EditPackage')));
const UpdatePassword = Loadable(lazy(() => import('views/dashboard/Default/UpdatePassword')));
const UpdateProfile = Loadable(lazy(() => import('views/dashboard/Default/UpdateProfile')));
const AddExtraIncome = Loadable(lazy(() => import('views/extra-income/AddExtraIncome')));
const CompletedExtraIncomes = Loadable(lazy(() => import('views/extra-income/CompletedExtraIncomes')));
const PendingExtraIncomes = Loadable(lazy(() => import('views/extra-income/PendingExtraIncomes')));
const EditExtraIncome = Loadable(lazy(() => import('views/extra-income/EditExtraIncome')));
const NotFound = Loadable(lazy(() => import('views/error/NotFound')));
const AllRoles = Loadable(lazy(() => import('views/roles/AllRoles')));
const AddRole = Loadable(lazy(() => import('views/roles/AddRole')));
const EditRole = Loadable(lazy(() => import('views/roles/EditRole')));




// ==============================|| MAIN ROUTING ||============================== //

const checkLogin = (element) => {
    if (jwt.getIsLogin() !== true) return <Navigate to="/login" replace={true} />;
    return element;
};

const MainRoutes = {
    path: '/dashboard',
    element: checkLogin(<MainLayout />),
    children: [
        { path: '/dashboard', element: checkLogin(<DashboardDefault />) },
        { path: '/dashboard/add-staff', element: checkLogin(<AddStaff />) },
        { path: '/dashboard/all-staff', element: checkLogin(<AllStaff />) },
        { path: '/dashboard/add-isp', element: checkLogin(<AddISP />) },
        { path: '/dashboard/edit-isp/:id', element: checkLogin(<EditISP />) },
        { path: '/dashboard/all-isps', element: checkLogin(<ViewAllISPs />) },
        { path: '/dashboard/add-package', element: checkLogin(<AddPackage />) },
        { path: '/dashboard/edit-package/:packageId', element: checkLogin(<EditPackage />) },
        { path: '/dashboard/all-packages', element: checkLogin(<AllPackages />) },
        { path: '/dashboard/create-entry', element: checkLogin(<AddEntry />) },
        { path: '/dashboard/edit-entry/:id', element: checkLogin(<EditEntry />) },
        { path: '/dashboard/all-entries', element: checkLogin(<AllEntries />) },
        { path: '/dashboard/pending-entries', element: checkLogin(<PendingEntries />) },
        { path: '/dashboard/complete-payment/:id', element: checkLogin(<CompletePayment />) },
        { path: '/dashboard/all-invoices', element: checkLogin(<AllInvoices />) },
        { path: '/dashboard/sent-invoices', element: checkLogin(<SentInvoices />) },
        { path: '/dashboard/send-invoice', element: checkLogin(<SendInvoice />) },
        { path: '/dashboard/add-user', element: checkLogin(<AddUser />) },
        { path: '/dashboard/edit-user', element: checkLogin(<EditUser />) },
        { path: '/dashboard/all-users', element: checkLogin(<AllUsers />) },
        { path: '/dashboard/add-expense', element: checkLogin(<AddExpense />) },
        { path: '/dashboard/all-expenses', element: checkLogin(<CompletedExpenses />) },
        { path: '/dashboard/pending-expenses', element: checkLogin(<PendingExpenses />) },
        { path: '/dashboard/update-password', element: checkLogin(<UpdatePassword />) },
        { path: '/dashboard/update-profile', element: checkLogin(<UpdateProfile />) },
        { path: '/dashboard/add-extra-income', element: checkLogin(<AddExtraIncome />) },
        { path: '/dashboard/completed-extra-incomes', element: checkLogin(<CompletedExtraIncomes />) },
        { path: '/dashboard/pending-extra-incomes', element: checkLogin(<PendingExtraIncomes />) },
        { path: '/dashboard/edit-extra-income', element: checkLogin(<EditExtraIncome />) },
        { path: '/dashboard/add-organization', element: checkLogin(<AddOrganization />) },
        { path: '/dashboard/all-organizations', element: checkLogin(<AllOrganizations />) },
        { path: '/dashboard/edit-organization/:id', element: checkLogin(<EditOrganization />) },
        { path: '*', element: checkLogin(<NotFound />) },
        { path: '/dashboard/all-roles', element: checkLogin(<AllRoles />) },
        { path: '/dashboard/add-role', element: checkLogin(<AddRole />) },
        { path: '/dashboard/edit-role/:id', element: checkLogin(<EditRole />) },
    ]
};

export default MainRoutes;