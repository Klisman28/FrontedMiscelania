import ApiService from '../ApiService'

export async function apiGetPurchases() {
    const res = ApiService.fetchData({
        url: '/purchases',
        method: 'get',
    })

    return res
}

export async function apiPostPurchas(data) {
    const res = ApiService.fetchData({
        url: '/purchases',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutPurchas(id, data) {
    const res = ApiService.fetchData({
        url: `/purchases/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeletePurchas(id) {
    const res = ApiService.fetchData({
        url: `/purchases/${id}`,
        method: 'delete'
    });

    return res
}

export async function apiGetPurchas(id) {
    const res = ApiService.fetchData({
        url: `/purchases/${id}`,
        method: 'get',
    })

    return res
}