// assets
import { IconShield } from '@tabler/icons';

// ==============================|| EXTRA ROLES MENU ITEMS ||============================== //

const roles = {
    id: 'roles',
    title: 'Roles',
    type: 'group',
    children: [
        {
            id: 'manage-roles',
            title: 'Manage Roles',
            type: 'collapse',
            icon: IconShield,
            children: [
                {
    id: 'add-role',
    title: 'Add Role',
    type: 'item',
    url: '/dashboard/add-role',
    target: false
},
{
    id: 'all-roles',
    title: 'All Roles',
    type: 'item',
    url: '/dashboard/all-roles',
    target: false
}
            ]
        }
    ]
};

export default roles;