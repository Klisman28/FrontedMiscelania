/**
 * RBAC Helper Functions
 * Provides role-based access control utilities
 */

/**
 * Role definitions
 * Maps frontend roles to uppercase for consistency
 */
export const ROLES = {
    ADMIN: 'ADMIN',
    SALES: 'SALES',      // Renamed from CAJERO to match backend
    WAREHOUSE: 'WAREHOUSE', // Renamed from BODEGUERO to match backend
    // Legacy support
    CAJERO: 'SALES',
    BODEGUERO: 'WAREHOUSE'
}

/**
 * Normalize role name to uppercase and map legacy names
 * @param {string} role - Role name to normalize
 * @returns {string} - Normalized role name
 */
export const normalizeRole = (role) => {
    const upperRole = role?.toUpperCase()
    return ROLES[upperRole] || upperRole
}

/**
 * Check if user has at least one of the required roles
 * @param {string[]} userRoles - Array of user's roles
 * @param {string[]} allowedRoles - Array of allowed roles for the resource
 * @returns {boolean} - True if user has at least one required role
 */
export const hasRole = (userRoles = [], allowedRoles = []) => {
    // Empty allowedRoles means accessible to all authenticated users
    if (!allowedRoles || allowedRoles.length === 0) {
        return true
    }

    // No user roles means not authorized
    if (!userRoles || userRoles.length === 0) {
        return false
    }

    // Normalize both arrays
    const normalizedUserRoles = userRoles.map(normalizeRole)
    const normalizedAllowedRoles = allowedRoles.map(normalizeRole)

    // Check for intersection
    return normalizedUserRoles.some(role => normalizedAllowedRoles.includes(role))
}

/**
 * Check if user can access a specific route
 * Alias for hasRole for better semantics
 * @param {string[]} userRoles - Array of user's roles
 * @param {string[]} allowedRoles - Array of allowed roles for the route
 * @returns {boolean} - True if user can access
 */
export const canAccess = (userRoles, allowedRoles) => {
    return hasRole(userRoles, allowedRoles)
}

/**
 * Check if user has admin role
 * @param {string[]} userRoles - Array of user's roles
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (userRoles = []) => {
    return userRoles.some(role => normalizeRole(role) === ROLES.ADMIN)
}

/**
 * Check if user has sales role
 * @param {string[]} userRoles - Array of user's roles
 * @returns {boolean} - True if user has sales role
 */
export const isSales = (userRoles = []) => {
    return userRoles.some(role => normalizeRole(role) === ROLES.SALES)
}

/**
 * Check if user has warehouse role
 * @param {string[]} userRoles - Array of user's roles
 * @returns {boolean} - True if user has warehouse role
 */
export const isWarehouse = (userRoles = []) => {
    return userRoles.some(role => normalizeRole(role) === ROLES.WAREHOUSE)
}

/**
 * Get primary role (first role in the list)
 * @param {string[]} userRoles - Array of user's roles
 * @returns {string|null} - Primary role or null
 */
export const getPrimaryRole = (userRoles = []) => {
    return userRoles.length > 0 ? normalizeRole(userRoles[0]) : null
}

/**
 * Permission matrix for different actions
 * Define what each role can do
 */
export const PERMISSIONS = {
    // Sales & Cash permissions
    SALES: {
        canViewSales: [ROLES.ADMIN, ROLES.SALES],
        canCreateSale: [ROLES.ADMIN, ROLES.SALES],
        canViewCashRegister: [ROLES.ADMIN, ROLES.SALES],
        canOpenCashRegister: [ROLES.ADMIN, ROLES.SALES],
        canCloseCashRegister: [ROLES.ADMIN, ROLES.SALES],
        canViewProducts: [ROLES.ADMIN, ROLES.SALES, ROLES.WAREHOUSE], // Read only
    },

    // Warehouse & Inventory permissions
    WAREHOUSE: {
        canViewWarehouses: [ROLES.ADMIN, ROLES.WAREHOUSE],
        canManageWarehouses: [ROLES.ADMIN],
        canViewStock: [ROLES.ADMIN, ROLES.WAREHOUSE, ROLES.SALES], // Read only for sales
        canReloadStock: [ROLES.ADMIN, ROLES.WAREHOUSE],
        canTransferStock: [ROLES.ADMIN, ROLES.WAREHOUSE],
        canAdjustInventory: [ROLES.ADMIN, ROLES.WAREHOUSE],
    },

    // Purchases permissions
    PURCHASES: {
        canViewPurchases: [ROLES.ADMIN, ROLES.WAREHOUSE],
        canCreatePurchase: [ROLES.ADMIN, ROLES.WAREHOUSE],
    },

    // Catalog permissions
    CATALOG: {
        canViewProducts: [ROLES.ADMIN, ROLES.SALES, ROLES.WAREHOUSE],
        canCreateProduct: [ROLES.ADMIN, ROLES.WAREHOUSE], // Optional: allow warehouse
        canEditProduct: [ROLES.ADMIN, ROLES.WAREHOUSE],
        canDeleteProduct: [ROLES.ADMIN],
        canManageCategories: [ROLES.ADMIN],
        canManageBrands: [ROLES.ADMIN],
    },

    // Organization permissions
    ORGANIZATION: {
        canViewUsers: [ROLES.ADMIN],
        canManageUsers: [ROLES.ADMIN],
        canViewEmployees: [ROLES.ADMIN],
        canManageEmployees: [ROLES.ADMIN],
        canViewSuppliers: [ROLES.ADMIN, ROLES.WAREHOUSE],
        canManageSuppliers: [ROLES.ADMIN],
    },

    // Clients permissions
    CLIENTS: {
        canViewClients: [ROLES.ADMIN, ROLES.SALES],
        canManageClients: [ROLES.ADMIN, ROLES.SALES],
    }
}

/**
 * Check if user has specific permission
 * @param {string[]} userRoles - Array of user's roles
 * @param {string} permission - Permission path (e.g., 'SALES.canCreateSale')
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (userRoles = [], permission) => {
    const [category, action] = permission.split('.')
    const allowedRoles = PERMISSIONS[category]?.[action]

    if (!allowedRoles) {
        console.warn(`Permission "${permission}" not found in PERMISSIONS matrix`)
        return false
    }

    return hasRole(userRoles, allowedRoles)
}
