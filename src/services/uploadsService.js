import ApiService from './ApiService'

const signedUrlCache = new Map()

export async function presignProductImage(data) {
    return ApiService.fetchData({
        url: '/uploads/products/presign',
        method: 'post',
        data
    })
}

export async function getSignedProductImageUrl(key) {
    return ApiService.fetchData({
        url: `/uploads/products/signed`,
        method: 'get',
        params: { key }
    })
}

export async function deleteProductImage(key) {
    return ApiService.fetchData({
        url: `/uploads/products`,
        method: 'delete',
        params: { key }
    })
}

/**
 * Helper function to fetch and cache signed URLs.
 * Resolves the signed URL string or null.
 */
export async function getOrFetchSignedUrl(key) {
    if (!key) return null

    const cacheEntry = signedUrlCache.get(key)
    const now = Date.now()

    // Assuming cache is valid for 50 minutes (3000000 ms)
    if (cacheEntry && cacheEntry.expiresAt > now) {
        return cacheEntry.url
    }

    try {
        const res = await getSignedProductImageUrl(key)
        const resData = res.data?.data || res.data
        const url = resData?.url
        if (url) {
            signedUrlCache.set(key, {
                url,
                expiresAt: now + 50 * 60 * 1000 // 50 minutos
            })
            return url
        }
    } catch (error) {
        console.error('Error fetching signed URL:', error)
    }

    return null
}
