import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// 3 items (Add, Completed, Pending) — dropdown rahega

const extraIncome = {
    id: 'extraIncome',
    title: 'Extra Income',
    type: 'group',
    children: [
        {
            id: 'extraIncome-collapse',
            title: 'Extra Income',
            type: 'collapse',
            icon: TrendingUpIcon,
            children: [
                {
                    id: 'completed-extraIncome',
                    title: 'Completed Incomes',
                    type: 'item',
                    url: '/dashboard/completed-extra-incomes',
                    breadcrumbs: false
                },
                {
                    id: 'pending-extraIncome',
                    title: 'Pending Incomes',
                    type: 'item',
                    url: '/dashboard/pending-extra-incomes',
                    breadcrumbs: false
                },
                {
                    id: 'add-extraIncome',
                    title: 'Add Extra Income',
                    type: 'item',
                    url: '/dashboard/add-extra-income',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default extraIncome;
