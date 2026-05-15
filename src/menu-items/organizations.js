import BusinessIcon from '@mui/icons-material/Business';

// Rule: Add + All only = sirf All show karo sidebar mein
// Add ka button All Organizations page ke andar hoga

const organizations = {
    id: 'organizations',
    title: 'Organizations',
    type: 'group',
    children: [
        {
            id: 'all-organizations',
            title: 'All Organizations',
            type: 'item',
            url: '/dashboard/all-organizations',
            icon: BusinessIcon,
            breadcrumbs: false
        }
    ]
};

export default organizations;
