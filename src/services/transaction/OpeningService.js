import ApiService from '../ApiService'

export async function apiGetOpenings() {
    const res = ApiService.fetchData({
        url: '/openings',
        method: 'get',
    })

    return res
}

export async function apiPostOpening(data) {
    const res = ApiService.fetchData({
        url: '/openings',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutOpening(id, data) {
    const res = ApiService.fetchData({
        url: `/openings/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteOpening(id) {
    const res = ApiService.fetchData({
        url: `/openings/${id}`,
        method: 'delete'
    });

    return res
}

export async function apiGetOpening(id) {
    const res = ApiService.fetchData({
        url: `/openings/${id}`,
        method: 'get',
    })

    return res
}

export async function apiGetOpeningCurrent() {
    const res = ApiService.fetchData({
        url: '/openings/current',
        method: 'get',
    })

    return res
}