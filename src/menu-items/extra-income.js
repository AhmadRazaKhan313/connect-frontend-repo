// assets
import { IconCashBanknote } from '@tabler/icons';

// ==============================|| EXTRA extraIncome MENU ITEMS ||============================== //

const extraIncome = {
    id: 'extraIncome',
    title: 'Extra Income',
    // caption: 'Handle your extraIncome',
    type: 'group',
    children: [
        {
            id: 'add',
            title: 'Extra Income',
            type: 'collapse',
            icon: IconCashBanknote,
            children: [
                {
                    id: 'add-extraIncome',
                    title: 'Add Extra Income',
                    type: 'item',
                    url: '/dashboard/add-extra-income',
                    target: false
                },
                {
                    id: 'completed-extraIncome',
                    title: 'Completed Incomes',
                    type: 'item',
                    url: '/dashboard/completed-extra-incomes',
                    target: false
                },
                {
                    id: 'pending-extraIncome',
                    title: 'Pending Incomes',
                    type: 'item',
                    url: '/dashboard/pending-extra-incomes',
                    target: false
                }
            ]
        }
    ]
};

export default extraIncome;
