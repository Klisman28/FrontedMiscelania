import ApiService from '../ApiService'

export async function apiGetEnterprises() {
    const res = ApiService.fetchData({
        url: '/enterprises',
        method: 'get',
    })

    return res
}

export async function apiPostEnterprise(data) {
    const res = ApiService.fetchData({
        url: '/enterprises',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutEnterprise(id, data) {
    const res = ApiService.fetchData({
        url: `/enterprises/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteEnterprise(id) {
    const res = ApiService.fetchData({
        url: `/enterprises/${id}`,
        method: 'delete'
    });

    return res
}