import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// 3 items (Add, All, Pending) — dropdown rahega

const expenses = {
    id: 'expenses',
    title: 'Expenses',
    type: 'group',
    children: [
        {
            id: 'expenses-collapse',
            title: 'Expenses',
            type: 'collapse',
            icon: AccountBalanceWalletIcon,
            children: [
                {
                    id: 'all-expenses',
                    title: 'All Expenses',
                    type: 'item',
                    url: '/dashboard/all-expenses',
                    breadcrumbs: false
                },
                {
                    id: 'pending-expenses',
                    title: 'Pending Expenses',
                    type: 'item',
                    url: '/dashboard/pending-expenses',
                    breadcrumbs: false
                },
                {
                    id: 'add-expense',
                    title: 'Add Expense',
                    type: 'item',
                    url: '/dashboard/add-expense',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default expenses;
