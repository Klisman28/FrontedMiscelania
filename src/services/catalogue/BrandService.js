import ApiService from '../ApiService'

export async function apiGetBrands() {
    const res = ApiService.fetchData({
        url: '/brands',
        method: 'get',
    })

    return res
}

export async function apiPostBrand(data) {
    const res = ApiService.fetchData({
        url: '/brands',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutBrand(id, data) {
    const res = ApiService.fetchData({
        url: `/brands/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteBrand(id) {
    const res = ApiService.fetchData({
        url: `/brands/${id}`,
        method: 'delete'
    });

    return res
}