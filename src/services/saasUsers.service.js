import BaseService from './BaseService'

export async function searchSaasUsers(params) {
    return BaseService.get('/saas/users', { params })
}

export async function getUserCompanies(userId) {
    return BaseService.get(`/saas/users/${userId}/companies`)
}

export async function getSaasRoles() {
    return BaseService.get('/saas/roles')
}
