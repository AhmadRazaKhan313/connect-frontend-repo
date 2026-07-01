import RouterIcon from '@mui/icons-material/Router';
import { hasAnyPermission } from 'utils/auth';

// Show the "Add ISP" sub-menu only to accounts that can manage ISPs
// (SUPER_ADMIN is covered by hasAnyPermission).
const canManageISP = hasAnyPermission(['isp.create', 'isp.edit', 'isp.delete']);

const isps = {
    id: 'isps',
    title: 'ISPs',
    type: 'group',
    children: [
        {
            id: 'isps-collapse',
            title: 'ISPs',
            type: canManageISP ? 'collapse' : 'item',
            icon: RouterIcon,
            url: canManageISP ? undefined : '/dashboard/all-isps',
            breadcrumbs: false,
            ...(canManageISP && {
                children: [
                    {
                        id: 'all-isps',
                        title: 'All ISPs',
                        type: 'item',
                        url: '/dashboard/all-isps',
                        breadcrumbs: false
                    },
                    {
                        id: 'add-isp',
                        title: 'Add ISP',
                        type: 'item',
                        url: '/dashboard/add-isp',
                        breadcrumbs: false
                    }
                ]
            })
        }
    ]
};

export default isps;
