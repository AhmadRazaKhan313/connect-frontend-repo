import DashboardIcon from '@mui/icons-material/Dashboard';

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: DashboardIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
