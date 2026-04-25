const PERMISSIONS = [
    // ISP
    { key: 'isp.view', label: 'View ISPs', group: 'ISP Management' },
    { key: 'isp.create', label: 'Add ISP', group: 'ISP Management' },
    { key: 'isp.edit', label: 'Edit ISP', group: 'ISP Management' },
    { key: 'isp.delete', label: 'Delete ISP', group: 'ISP Management' },

    // Package
    { key: 'package.view', label: 'View Packages', group: 'Package Management' },
    { key: 'package.create', label: 'Add Package', group: 'Package Management' },
    { key: 'package.edit', label: 'Edit Package', group: 'Package Management' },
    { key: 'package.delete', label: 'Delete Package', group: 'Package Management' },

    // User
    { key: 'user.view', label: 'View Users', group: 'User Management' },
    { key: 'user.create', label: 'Add User', group: 'User Management' },
    { key: 'user.edit', label: 'Edit User', group: 'User Management' },
    { key: 'user.delete', label: 'Delete User', group: 'User Management' },

    // Staff
    { key: 'staff.view', label: 'View Staff', group: 'Staff Management' },
    { key: 'staff.create', label: 'Add Staff', group: 'Staff Management' },
    { key: 'staff.edit', label: 'Edit Staff', group: 'Staff Management' },
    { key: 'staff.delete', label: 'Delete Staff', group: 'Staff Management' },

    // Entry
    { key: 'entry.view', label: 'View Entries', group: 'Entries' },
    { key: 'entry.create', label: 'Add Entry', group: 'Entries' },
    { key: 'entry.edit', label: 'Edit Entry', group: 'Entries' },
    { key: 'entry.delete', label: 'Delete Entry', group: 'Entries' },

    // Expense
    { key: 'expense.view', label: 'View Expenses', group: 'Expenses' },
    { key: 'expense.create', label: 'Add Expense', group: 'Expenses' },
    { key: 'expense.approve', label: 'Approve Expense', group: 'Expenses' },
    { key: 'expense.delete', label: 'Delete Expense', group: 'Expenses' },

    // Invoice
    { key: 'invoice.view', label: 'View Invoices', group: 'Invoices' },
    { key: 'invoice.create', label: 'Create Invoice', group: 'Invoices' },
    { key: 'invoice.delete', label: 'Delete Invoice', group: 'Invoices' },

    // Extra Income
    { key: 'extraIncome.view', label: 'View Extra Income', group: 'Extra Income' },
    { key: 'extraIncome.create', label: 'Add Extra Income', group: 'Extra Income' },
    { key: 'extraIncome.edit', label: 'Edit Extra Income', group: 'Extra Income' },
    { key: 'extraIncome.delete', label: 'Delete Extra Income', group: 'Extra Income' },
];

export default PERMISSIONS;