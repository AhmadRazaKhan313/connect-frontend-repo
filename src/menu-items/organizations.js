// assets
import { IconBuildingSkyscraper, IconUsers } from '@tabler/icons';

// ==============================|| PLATFORM SUPER ADMIN MENU ITEMS ||============================== //

const organizations = {
    id: 'administration',
    title: 'Administration',
    type: 'group',
    children: [
        {
            id: 'manage-organizations',
            title: 'Manage Organizations',
            type: 'collapse',
            icon: IconBuildingSkyscraper,
            children: [
                {
                    id: 'add-organization',
                    title: 'Add Organization',
                    type: 'item',
                    url: '/dashboard/add-organization',
                    target: false
                },
                {
                    id: 'all-organizations',
                    title: 'All Organizations',
                    type: 'item',
                    url: '/dashboard/all-organizations',
                    target: false
                }
            ]
        },
        {
            id: 'manage-users',
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

export default organizations;