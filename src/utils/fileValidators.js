
export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
export const maxImageSize = 2 * 1024 * 1024 // 2MB

export const validateImageFile = (file) => {
    if (!file) return { valid: true }

    if (!allowedImageTypes.includes(file.type)) {
        return { valid: false, error: 'Formato no soportado (use jpg, png, webp)' }
    }

    if (file.size > maxImageSize) {
        return { valid: false, error: 'El archivo excede el tamaño máximo (2MB)' }
    }

    return { valid: true }
}
