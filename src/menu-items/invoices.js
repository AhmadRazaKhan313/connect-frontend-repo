// assets
import { IconReceipt2 } from '@tabler/icons';

// ==============================|| EXTRA ISP MENU ITEMS ||============================== //

const invoices = {
    id: 'invoices',
    title: 'Manage Invoices',
    // caption: 'Handle your invoices',
    type: 'group',
    children: [
        {
            id: 'add',
            title: 'Manage Invoices',
            type: 'collapse',
            icon: IconReceipt2,
            children: [
                {
                    id: 'invoice',
                    title: 'Send Invoice',
                    type: 'item',
                    url: '/dashboard/send-invoice',
                    target: false
                },
                {
                    id: 'invoice',
                    title: 'Invoices',
                    type: 'item',
                    url: '/dashboard/all-invoices',
                    target: false
                },
                {
                    id: 'invoice',
                    title: 'Sent Invoices',
                    type: 'item',
                    url: '/dashboard/sent-invoices',
                    target: false
                }
            ]
        }
    ]
};

export default invoices;
