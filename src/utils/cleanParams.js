export function cleanParams(obj) {
    const out = {}
    Object.entries(obj || {}).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        if (typeof v === 'string' && v.trim() === '') return

        if (k === 'sort' && typeof v === 'object') {
            if (v.key && v.order) {
                out[k] = JSON.stringify(v)
            }
            return
        }

        out[k] = v
    })
    return out
}
