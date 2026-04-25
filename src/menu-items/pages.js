// assets
import { IconKey } from '@tabler/icons';

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Authentication',
            type: 'collapse',
            icon: IconKey,
            children: [
                {
                    id: 'login',
                    title: 'Login',
                    type: 'item',
                    url: '/login',
                    target: false
                }
            ]
        }
    ]
};

export default pages;
