// assets
import { IconFileInvoice } from '@tabler/icons';

// ==============================|| EXTRA ISP MENU ITEMS ||============================== //

const entries = {
    id: 'entries',
    title: 'entries',
    // caption: 'Handle your invoices',
    type: 'group',
    children: [
        {
            id: 'add',
            title: 'User Entry',
            type: 'collapse',
            icon: IconFileInvoice,
            children: [
                {
                    id: 'create-entry',
                    title: 'Create Entry',
                    type: 'item',
                    url: '/dashboard/create-entry',
                    target: false
                },
                {
                    id: 'all-entries',
                    title: 'All Entries',
                    type: 'item',
                    url: '/dashboard/all-entries',
                    target: false
                },
                {
                    id: 'pending-entries',
                    title: 'Pending Entries',
                    type: 'item',
                    url: '/dashboard/pending-entries',
                    target: false
                }
            ]
        }
    ]
};

export default entries;
