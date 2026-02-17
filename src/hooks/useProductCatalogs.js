import { useState, useCallback, useEffect } from 'react'
import CatalogsApi from 'services/catalogs.api'
import { toast, Notification } from 'components/ui'

const useProductCatalogs = () => {
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [brands, setBrands] = useState([])
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const mapOptions = (list) => list.map(item => ({
        value: String(item.id),
        label: item.name || item.nombre || item.title || `ID ${item.id}`,
        original: item // Para acceder a propiedades extra como categoryId
    }))

    const loadAll = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const [catsRes, brandsRes, unitsRes] = await Promise.allSettled([
                CatalogsApi.getCategories(),
                CatalogsApi.getBrands(),
                CatalogsApi.getUnits()
            ])

            // Manejo de Categorías
            if (catsRes.status === 'fulfilled') {
                setCategories(mapOptions(catsRes.value))
            } else {
                console.error('Error loading categories:', catsRes.reason)
            }

            // Manejo de Marcas
            if (brandsRes.status === 'fulfilled') {
                setBrands(mapOptions(brandsRes.value))
            }

            // Manejo de Unidades
            if (unitsRes.status === 'fulfilled') {
                setUnits(mapOptions(unitsRes.value))
            }

        } catch (err) {
            console.error('Error loading catalogs:', err)
            setError('Error al cargar algunos catálogos')
            toast.push(
                <Notification title="Error" type="danger">
                    No se pudieron cargar todos los catálogos.
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }, [])

    const loadSubcategories = useCallback(async (categoryId) => {
        if (!categoryId) {
            setSubcategories([])
            return
        }

        // Activamos loading para dar feedback visual (placeholders se mostrarán como 'Cargando...')
        setLoading(true)
        try {
            const list = await CatalogsApi.getSubcategories(categoryId)
            setSubcategories(mapOptions(list))
        } catch (err) {
            console.error('Error loading subcategories:', err)
            toast.push(
                <Notification title="Error" type="danger">
                    Error cargando subcategorías
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        categories,
        subcategories,
        brands,
        units,
        loading,
        error,
        loadAll,
        loadSubcategories
    }
}

export default useProductCatalogs
