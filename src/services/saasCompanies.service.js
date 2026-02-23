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
