import ApiService from '../ApiService'

export async function apiCreateCashMovement(openingId, data) {
    return ApiService.fetchData({
        url: `/openings/${openingId}/movements`,
        method: 'post',
        data
    })
}

export async function apiGetCashMovements(openingId, params) {
    return ApiService.fetchData({
        url: `/openings/${openingId}/movements`,
        method: 'get',
        params
    })
}

export async function apiGetOpeningSummary(openingId) {
    return ApiService.fetchData({
        url: `/openings/${openingId}/summary`,
        method: 'get'
    })
}
