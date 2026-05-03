import GroupIcon from '@mui/icons-material/Group';

// Add + All only = sirf All show karo sidebar mein
// Add User button AllUsers page ke andar hoga

const users = {
    id: 'users',
    title: 'Users',
    type: 'group',
    children: [
        {
            id: 'all-users',
            title: 'All Users',
            type: 'item',
            url: '/dashboard/all-users',
            icon: GroupIcon,
            breadcrumbs: false
        }
    ]
};

export default users;
