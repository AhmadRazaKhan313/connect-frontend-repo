import jwt from 'jwtservice/jwtService';

// Centralized access helpers. Access is derived entirely from the account's
// role permissions (there is no hardcoded/system role).

export const getCurrentUser = () => jwt.getUser();

export const getPermissions = () => {
    const u = getCurrentUser();
    return Array.isArray(u?.permissions) ? u.permissions : [];
};

export const hasPermission = (perm) => getPermissions().includes(perm);

export const hasAnyPermission = (perms = []) => perms.some((p) => getPermissions().includes(p));

// Platform admin = an account whose role includes organization-management permissions.
export const canManageOrganizations = () => hasAnyPermission(['organization.view', 'organization.create', 'organization.edit', 'organization.delete']);

export const isPartner = () => getCurrentUser()?.isPartner === true;

export const isPlatformUser = () => getCurrentUser()?.isPlatform === true;
