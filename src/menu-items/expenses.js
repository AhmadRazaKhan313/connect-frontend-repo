// assets
import { IconCashBanknote } from '@tabler/icons';

// ==============================|| EXTRA ISP MENU ITEMS ||============================== //

const expenses = {
    id: 'expenses',
    title: 'Manage Expenses',
    type: 'group',
    children: [
        {
            id: 'add',
            title: 'Manage Expenses',
            type: 'collapse',
            icon: IconCashBanknote,
            children: [
                {
                    id: 'expenses',
                    title: 'Add Expense',
                    type: 'item',
                    url: '/dashboard/add-expense',
                    target: false
                },
                {
                    id: 'expenses',
                    title: 'All Expenses',
                    type: 'item',
                    url: '/dashboard/all-expenses',
                    target: false
                },
                {
                    id: 'expenses',
                    title: 'Pending Expenses',
                    type: 'item',
                    url: '/dashboard/pending-expenses',
                    target: false
                }
            ]
        }
    ]
};

export default expenses;
