// assets
import { IconUser } from '@tabler/icons';

// ==============================|| EXTRA staff MENU ITEMS ||============================== //

const staff = {
    id: 'staff',
    title: 'Staff',
    // caption: 'Handle your staff',
    type: 'group',
    children: [
        {
            id: 'add',
            title: 'Manage Staff',
            type: 'collapse',
            icon: IconUser,
            children: [
                {
                    id: 'add-staff',
                    title: 'Add Staff',
                    type: 'item',
                    url: '/dashboard/add-staff',
                    target: false
                },
                {
                    id: 'all-staff',
                    title: 'All Staff',
                    type: 'item',
                    url: '/dashboard/all-staff',
                    target: false
                }
            ]
        }
    ]
};

export default staff;
