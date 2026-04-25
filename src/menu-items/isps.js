// assets
import { IconNetwork } from '@tabler/icons';
import jwt from 'jwtservice/jwtService';
import { STAFF_TYPES } from 'utils/Constants';

// ==============================|| EXTRA ISP MENU ITEMS ||============================== //
let children = [];
(jwt.getUser()?.type === 'orgAdmin' || jwt.getUser()?.type === 'orgSuperAdmin') &&
    children.push({
        id: 'add-isp',
        title: 'Add ISP',
        type: 'item',
        url: '/dashboard/add-isp',
        target: false
    });
children.push({
    id: 'all-isps',
    title: 'All ISPs',
    type: 'item',
    url: '/dashboard/all-isps',
    target: false
});
const isps = {
    id: 'isps',
    title: 'ISPs',
    type: 'group',
    children: [
        {
            id: 'add',
            title: 'Manage ISPs',
            type: 'collapse',
            icon: IconNetwork,
            children
        }
    ]
};

export default isps;
