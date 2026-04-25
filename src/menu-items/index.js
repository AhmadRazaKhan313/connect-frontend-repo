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

const MASTER_ORG_ID = '69e6ea81f25b8158cf1c62ac';

const PLATFORM_SUPER_ADMIN = [dashboard, organizations, roles, isps, staff, users, expenses, entries, invoices, extraIncome];

const getFilteredMenu = (type, role, orgFeatures) => {
    const isAdmin = type === 'orgAdmin' || type === 'orgSuperAdmin' || role === 'orgSuperAdmin';

    const menu = [dashboard];

    // orgFeatures null ho toh sab show karo
    if (!orgFeatures) {
        if (isAdmin) return [dashboard, isps, staff, users, expenses, entries, invoices, extraIncome, roles];
        return [dashboard, isps, users, entries];
    }

    if (orgFeatures?.ispManagement) menu.push(isps);
    if (isAdmin && orgFeatures?.staffManagement) menu.push(staff);
    menu.push(users);
    if (isAdmin && orgFeatures?.expenses) menu.push(expenses);
    menu.push(entries);
    if (isAdmin && orgFeatures?.invoicing) menu.push(invoices);
    if (isAdmin && orgFeatures?.extraIncome) menu.push(extraIncome);
    if (isAdmin) menu.push(roles);

    return menu;
};

export const getMenuItems = (orgFeatures) => {
    const role = jwt.getUser()?.role;
    const type = jwt.getUser()?.type;
    const isSuperOrg = jwt.getUser()?.organizationId === MASTER_ORG_ID;

    if (isSuperOrg) {
        return PLATFORM_SUPER_ADMIN;
    }

    return getFilteredMenu(type, role, orgFeatures);
};

const menuItems = { items: [] };
export default menuItems;