import jwt from 'jwtservice/jwtService';
import dashboard from './dashboard';
import entries from './entries';
import expenses from './expenses';
import invoices from './invoices';
import isps from './isps';
import staff from './staff';
import users from './users';
import extraIncome from './extra-income';
import organizations from './organizations';
import roles from './roles';

// ─── Permission → Menu mapping ───────────────────────────────────────────────
// Kisi bhi ek permission hone par tab dikhao
const MENU_PERMISSION_MAP = {
    dashboard:   ['dashboard.view'],
    isps:        ['isp.view',         'isp.create',         'isp.edit',     'isp.delete'],
    users:       ['user.view',        'user.create',        'user.edit',    'user.delete'],
    staff:       ['staff.view',       'staff.create',       'staff.edit',   'staff.delete'],
    expenses:    ['expense.view',     'expense.create',     'expense.approve', 'expense.delete'],
    entries:     ['entry.view',       'entry.create',       'entry.edit',   'entry.delete'],
    invoices:    ['invoice.view',     'invoice.create',     'invoice.delete'],
    extraIncome: ['extraIncome.view', 'extraIncome.create', 'extraIncome.edit', 'extraIncome.delete'],
};

// ─── Menu Groups ─────────────────────────────────────────────────────────────

const PLATFORM_SUPER_ADMIN_MENU = [
    dashboard,
    organizations,
    isps,
    staff,
    users,
    expenses,
    entries,
    invoices,
    extraIncome,
    roles,
];

const ORG_SUPER_ADMIN_MENU = [
    dashboard,
    isps,
    staff,
    users,
    expenses,
    entries,
    invoices,
    extraIncome,
    roles,
];

const ORG_ADMIN_MENU = [
    dashboard,
    isps,
    staff,
    users,
    expenses,
    entries,
    invoices,
    extraIncome,
    roles,
];

// ─── orgStaff ke liye permission-based dynamic menu ─────────────────────────
const getOrgStaffMenu = (permissions = []) => {
    // Helper: koi bhi ek permission match ho to true
    const hasAny = (keys) => keys.some((k) => permissions.includes(k));

    const menu = [];

    if (hasAny(MENU_PERMISSION_MAP.dashboard))   menu.push(dashboard);
    if (hasAny(MENU_PERMISSION_MAP.isps))        menu.push(isps);
    if (hasAny(MENU_PERMISSION_MAP.users))       menu.push(users);
    if (hasAny(MENU_PERMISSION_MAP.staff))       menu.push(staff);
    if (hasAny(MENU_PERMISSION_MAP.expenses))    menu.push(expenses);
    if (hasAny(MENU_PERMISSION_MAP.entries))     menu.push(entries);
    if (hasAny(MENU_PERMISSION_MAP.invoices))    menu.push(invoices);
    if (hasAny(MENU_PERMISSION_MAP.extraIncome)) menu.push(extraIncome);

    return menu;
};

// ─── Menu Selector ───────────────────────────────────────────────────────────
const getMenuItems = () => {
    const user    = jwt.getUser();
    const userType = user?.type;
    const userRole = user?.role;

    const isPlatformSuperAdmin =
        userType === 'platformSuperAdmin' ||
        userRole === 'platformSuperAdmin';

    if (isPlatformSuperAdmin) {
        return { items: PLATFORM_SUPER_ADMIN_MENU };
    }

    if (userType === 'orgSuperAdmin' || userRole === 'orgSuperAdmin') {
        return { items: ORG_SUPER_ADMIN_MENU };
    }

    if (
        userType === 'orgAdmin' || userRole === 'orgAdmin' ||
        userType === 'admin'   || userType === 'superadmin'
    ) {
        return { items: ORG_ADMIN_MENU };
    }

    // orgStaff — permissions se menu banao
    const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
    return { items: getOrgStaffMenu(permissions) };
};

export default getMenuItems;
