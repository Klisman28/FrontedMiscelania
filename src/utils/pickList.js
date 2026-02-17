export function pickList(res, key) {
    const arr = res?.data?.data?.[key]
    return Array.isArray(arr) ? arr : []
}
