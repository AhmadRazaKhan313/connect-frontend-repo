import RouterIcon from '@mui/icons-material/Router';
import jwt from 'jwtservice/jwtService';

const userType = jwt.getUser()?.type;
const userRole = jwt.getUser()?.role;

const canAddISP =
    userType === 'platformSuperAdmin' ||
    userRole === 'platformSuperAdmin' ||
    userType === 'orgSuperAdmin' ||
    userRole === 'orgSuperAdmin' ||
    userType === 'orgAdmin' ||
    userRole === 'orgAdmin';

const isps = {
    id: 'isps',
    title: 'ISPs',
    type: 'group',
    children: [
        {
            id: 'isps-collapse',
            title: 'ISPs',
            type: canAddISP ? 'collapse' : 'item',
            icon: RouterIcon,
            url: canAddISP ? undefined : '/dashboard/all-isps',
            breadcrumbs: false,
            ...(canAddISP && {
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