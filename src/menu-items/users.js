// assets
import { IconUsers } from '@tabler/icons';

// ==============================|| EXTRA ISP MENU ITEMS ||============================== //

const users = {
    id: 'users',
    title: 'users',
    // caption: 'Handle your users',
    type: 'group',
    children: [
        {
            id: 'add',
            title: 'Manage Users',
            type: 'collapse',
            icon: IconUsers,
            children: [
                {
                    id: 'add-user',
                    title: 'Add User',
                    type: 'item',
                    url: '/dashboard/add-user',
                    target: false
                },
                {
                    id: 'all-users',
                    title: 'All Users',
                    type: 'item',
                    url: '/dashboard/all-users',
                    target: false
                }
            ]
        }
    ]
};

export default users;
