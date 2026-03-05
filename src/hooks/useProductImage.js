import { useState, useEffect } from 'react'
import { getOrFetchSignedUrl } from 'services/uploadsService'

/**
 * Hook que resuelve la imagen de un producto.
 * Prioridad: imageUrl existente > signed URL desde imageKey > null
 */
const useProductImage = (product) => {
    const [imageSrc, setImageSrc] = useState(product?.imageUrl || product?.img || '')

    useEffect(() => {
        let mounted = true

        // Si ya tiene una URL directa (legacy), usarla
        if (product?.imageUrl || product?.img) {
            setImageSrc(product.imageUrl || product.img)
            return
        }

        // Si tiene imageKey, resolver la signed URL
        if (product?.imageKey) {
            getOrFetchSignedUrl(product.imageKey).then(url => {
                if (mounted && url) {
                    setImageSrc(url)
                }
            })
        } else {
            setImageSrc('')
        }

        return () => { mounted = false }
    }, [product?.imageKey, product?.imageUrl, product?.img])

    return imageSrc
}

export default useProductImage
