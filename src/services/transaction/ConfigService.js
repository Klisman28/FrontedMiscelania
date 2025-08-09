import ApiService from '../ApiService'

export async function apiGetConfigs() {
    const res = ApiService.fetchData({
        url: '/configs',
        method: 'get',
    })

    return res
}

export async function apiPostConfig(data) {
    const res = ApiService.fetchData({
        url: '/configs',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutConfig(id, data) {
    const res = ApiService.fetchData({
        url: `/configs/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteConfig(id) {
    const res = ApiService.fetchData({
        url: `/configs/${id}`,
        method: 'delete'
    });

    return res
}

export async function apiGetConfig(id) {
    const res = ApiService.fetchData({
        url: `/configs/${id}`,
        method: 'get',
    })

    return res
}