import BaseService from './BaseService'

export async function searchSaasUsers(params) {
    return BaseService.get('/users', { params })
}
