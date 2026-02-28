import BaseService from './BaseService'

export async function getSaasCompanies(params) {
    const response = await BaseService.get('/saas/companies', { params })
    // Normalize response: 
    // Handle standard wrapper { data: { ... } }, legacy { body: { ... } }, or direct { ... }
    const payload = response.data?.data || response.data?.body || response.data || {}
    return {
        items: Array.isArray(payload.companies) ? payload.companies : [],
        total: payload.total || 0,
        pagination: payload.pagination || {}
    }
}

export async function createSaasCompany(data) {
    return BaseService.post('/saas/companies', data)
}

export async function updateSaasCompanyStatus(id, status) {
    return BaseService.patch(`/saas/companies/${id}/status`, { status })
}

export async function updateSaasCompanySeats(id, seats) {
    return BaseService.patch(`/saas/companies/${id}/seats`, { seats })
}

// Company Members 
export async function getCompanyMembers(companyId) {
    return BaseService.get(`/saas/companies/${companyId}/members`)
}

export async function assignCompanyMember(companyId, data) {
    // data = { userId, role }
    return BaseService.post(`/saas/companies/${companyId}/members`, data)
}

export async function updateCompanyMember(companyId, userId, payload) {
    // payload: { role?, status? }
    return BaseService.patch(`/saas/companies/${companyId}/members/${userId}`, payload)
}

export async function removeCompanyMember(companyId, userId) {
    return BaseService.delete(`/saas/companies/${companyId}/members/${userId}`)
}

export async function hardDeleteMember(companyId, userId) {
    return BaseService.delete(`/saas/companies/${companyId}/members/${userId}?hard=true`)
}
