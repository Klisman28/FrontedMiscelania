import ApiService from '../ApiService'

export async function apiGetCashiers() {
    const res = ApiService.fetchData({
        url: '/cashiers',
        method: 'get',
    })

    return res
}

export async function apiPostCashier(data) {
    const res = ApiService.fetchData({
        url: '/cashiers',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutCashier(id, data) {
    const res = ApiService.fetchData({
        url: `/cashiers/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteCashier(id) {
    const res = ApiService.fetchData({
        url: `/cashiers/${id}`,
        method: 'delete'
    });

    return res
}

export async function apiGetCashier(id) {
    const res = ApiService.fetchData({
        url: `/cashiers/${id}`,
        method: 'get',
    })

    return res
}

export async function apiGetCashiersAvailable() {
    const res = ApiService.fetchData({
        url: '/cashiers/available',
        method: 'get',
    })

    return res
}