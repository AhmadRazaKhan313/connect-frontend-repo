import PeopleIcon from '@mui/icons-material/People';

// Rule: Add + All only = sirf All show karo sidebar mein
// Add Staff button AllStaff page ke andar hoga

const staff = {
    id: 'staff',
    title: 'Staff',
    type: 'group',
    children: [
        {
            id: 'all-staff',
            title: 'All Staff',
            type: 'item',
            url: '/dashboard/all-staff',
            icon: PeopleIcon,
            breadcrumbs: false
        }
    ]
};

export default staff;
