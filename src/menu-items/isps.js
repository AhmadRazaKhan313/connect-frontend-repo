import RouterIcon from '@mui/icons-material/Router';
import jwt from 'jwtservice/jwtService';
import { STAFF_TYPES } from 'utils/Constants';

// Admin ke liye: Add ISP bhi hoga + All ISPs — 2+ items so dropdown
// Staff ke liye: sirf All ISPs — direct item (no dropdown)

const isAdmin = jwt.getUser()?.type === STAFF_TYPES.admin;

const isps = isAdmin
    ? {
          id: 'isps',
          title: 'ISPs',
          type: 'group',
          children: [
              {
                  id: 'isps-collapse',
                  title: 'ISPs',
                  type: 'collapse',
                  icon: RouterIcon,
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
              }
          ]
      }
    : {
          id: 'isps',
          title: 'ISPs',
          type: 'group',
          children: [
              {
                  id: 'all-isps',
                  title: 'All ISPs',
                  type: 'item',
                  url: '/dashboard/all-isps',
                  icon: RouterIcon,
                  breadcrumbs: false
              }
          ]
      };

export default isps;
