import ApiService from '../ApiService'

export async function apiGetSuppliers() {
    const res = ApiService.fetchData({
        url: '/suppliers',
        method: 'get',
    })

    return res
}

export async function apiPostSupplier(data) {
    const res = ApiService.fetchData({
        url: '/suppliers',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutSupplier(id, data) {
    const res = ApiService.fetchData({
        url: `/suppliers/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteSupplier(id) {
    const res = ApiService.fetchData({
        url: `/suppliers/${id}`,
        method: 'delete'
    });

    return res
}