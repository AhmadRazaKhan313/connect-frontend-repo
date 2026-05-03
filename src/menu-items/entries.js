import AssignmentIcon from '@mui/icons-material/Assignment';

// 3 items hain (Create, All, Pending) — dropdown rahega

const entries = {
    id: 'entries',
    title: 'Entries',
    type: 'group',
    children: [
        {
            id: 'entries-collapse',
            title: 'User Entries',
            type: 'collapse',
            icon: AssignmentIcon,
            children: [
                {
                    id: 'all-entries',
                    title: 'All Entries',
                    type: 'item',
                    url: '/dashboard/all-entries',
                    breadcrumbs: false
                },
                {
                    id: 'pending-entries',
                    title: 'Pending Entries',
                    type: 'item',
                    url: '/dashboard/pending-entries',
                    breadcrumbs: false
                },
                {
                    id: 'create-entry',
                    title: 'Create Entry',
                    type: 'item',
                    url: '/dashboard/create-entry',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default entries;
