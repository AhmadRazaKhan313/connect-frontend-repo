import { getPermissions } from 'utils/auth';
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

// A menu group is shown if the account's permissions include ANY of its keys.
const MENU_PERMISSION_MAP = {
    dashboard:     ['dashboard.view'],
    organizations: ['organization.view', 'organization.create', 'organization.edit', 'organization.delete'],
    isps:          ['isp.view', 'isp.create', 'isp.edit', 'isp.delete'],
    users:         ['user.view', 'user.create', 'user.edit', 'user.delete'],
    staff:         ['staff.view', 'staff.create', 'staff.edit', 'staff.delete'],
    roles:         ['role.view', 'role.create', 'role.edit', 'role.delete'],
    expenses:      ['expense.view', 'expense.create', 'expense.edit', 'expense.approve', 'expense.delete'],
    entries:       ['entry.view', 'entry.create', 'entry.edit', 'entry.delete'],
    invoices:      ['invoice.view', 'invoice.create', 'invoice.edit', 'invoice.delete'],
    extraIncome:   ['extraIncome.view', 'extraIncome.create', 'extraIncome.edit', 'extraIncome.delete'],
};

const buildMenu = (permissions = []) => {
    const hasAny = (keys) => keys.some((k) => permissions.includes(k));
    const menu = [];
    if (hasAny(MENU_PERMISSION_MAP.dashboard))     menu.push(dashboard);
    if (hasAny(MENU_PERMISSION_MAP.organizations)) menu.push(organizations);
    if (hasAny(MENU_PERMISSION_MAP.isps))          menu.push(isps);
    if (hasAny(MENU_PERMISSION_MAP.users))         menu.push(users);
    if (hasAny(MENU_PERMISSION_MAP.staff))         menu.push(staff);
    if (hasAny(MENU_PERMISSION_MAP.roles))         menu.push(roles);
    if (hasAny(MENU_PERMISSION_MAP.expenses))      menu.push(expenses);
    if (hasAny(MENU_PERMISSION_MAP.entries))       menu.push(entries);
    if (hasAny(MENU_PERMISSION_MAP.invoices))      menu.push(invoices);
    if (hasAny(MENU_PERMISSION_MAP.extraIncome))   menu.push(extraIncome);
    return menu;
};

const getMenuItems = () => ({ items: buildMenu(getPermissions()) });

export default getMenuItems;