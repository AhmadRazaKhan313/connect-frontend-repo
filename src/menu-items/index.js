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

// ─── Menu Groups ────────────────────────────────────────────────────────────

// Platform Super Admin — sab kuch dekhta hai + organizations manage karta hai
const PLATFORM_SUPER_ADMIN_MENU = [
    dashboard,
    organizations,   // orgs manage karna sirf platformSuperAdmin ka kaam
    isps,
    staff,
    users,
    expenses,
    entries,
    invoices,
    extraIncome,
    roles,
];

// Org Super Admin — apni org ka sab kuch, ISP add bhi, roles bhi
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

// Org Admin — same as orgSuperAdmin lekin organizations nahi
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

// Org Staff — sirf assigned permissions ke mutabiq
const ORG_STAFF_MENU = [
    dashboard,
    isps,
    users,
    expenses,
    entries,
    invoices,
    extraIncome,
    // roles nahi — staff khud roles manage nahi karta
];

// ─── Menu Selector ──────────────────────────────────────────────────────────

const getMenuItems = () => {
    const user = jwt.getUser();
    const userType = user?.type;
    const userRole = user?.role;

    // platformSuperAdmin — STRICTLY type aur role — isHQ removed
    // isHQ org ka flag hai, user ka nahi
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
        userType === 'admin' || userType === 'superadmin' // legacy support
    ) {
        return { items: ORG_ADMIN_MENU };
    }

    // orgStaff ya koi bhi aur
    return { items: ORG_STAFF_MENU };
};

export default getMenuItems;