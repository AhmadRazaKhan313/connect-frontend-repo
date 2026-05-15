import ReceiptIcon from '@mui/icons-material/Receipt';

// 3 items (Send, All, Sent) — dropdown rahega

const invoices = {
    id: 'invoices',
    title: 'Invoices',
    type: 'group',
    children: [
        {
            id: 'invoices-collapse',
            title: 'Invoices',
            type: 'collapse',
            icon: ReceiptIcon,
            children: [
                {
                    id: 'all-invoices',
                    title: 'All Invoices',
                    type: 'item',
                    url: '/dashboard/all-invoices',
                    breadcrumbs: false
                },
                {
                    id: 'sent-invoices',
                    title: 'Sent Invoices',
                    type: 'item',
                    url: '/dashboard/sent-invoices',
                    breadcrumbs: false
                },
                {
                    id: 'send-invoice',
                    title: 'Send Invoice',
                    type: 'item',
                    url: '/dashboard/send-invoice',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default invoices;
