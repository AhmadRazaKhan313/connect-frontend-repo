import jwt from 'jwtservice/jwtService';
import { STAFF_TYPES } from 'utils/Constants';
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

// Platform Super Admin (HQ) — sirf dashboard + organizations
const PLATFORM_SUPER_ADMIN = [dashboard, organizations];

// Org Super Admin — full access with roles
const ORG_SUPER_ADMIN = [dashboard, isps, staff, users, expenses, entries, invoices, extraIncome, roles];

// Org Admin — full access with roles
const ADMIN = [dashboard, isps, staff, users, expenses, entries, invoices, extraIncome, roles];

// Org Staff — limited
const STAFF = [dashboard, isps, users, expenses, entries, invoices, extraIncome];

const getMenuItems = () => {
    const userType = jwt.getUser()?.type;

    return {
        items:
            userType === STAFF_TYPES.platformSuperAdmin
                ? PLATFORM_SUPER_ADMIN
                : userType === STAFF_TYPES.orgSuperAdmin
                ? ORG_SUPER_ADMIN
                : userType === STAFF_TYPES.admin
                ? ADMIN
                : STAFF
    };
};

export default getMenuItems;