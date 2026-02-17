import { useState, useEffect, useCallback } from 'react'
import { getCategories, getSubcategories, getBrands, getUnits } from '../services/catalogs.api'
import { toast, Notification } from 'components/ui'
import React from 'react' // needed for JSX in toast

const useCatalogs = () => {
    const [catalogs, setCatalogs] = useState({
        categories: [],
        subcategories: [], // Raw list, used for fitlering
        brands: [],
        units: []
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const normalize = (response) => {
        // Handle various response structures
        if (Array.isArray(response?.data)) return response.data
        if (Array.isArray(response?.data?.data)) return response.data.data
        if (response?.data && typeof response?.data === 'object') {
            // Try to find an array property or return empty
            // Sometimes backend just returns { ok: true, data: [...] }
            if (Array.isArray(response.data)) return response.data
            // Or maybe { categories: [...] }?
            // Safest fallback based on typical Elstar/Laravel patterns
        }
        return []
    }

    const mapToOptions = (list, labelKey = 'name') => {
        if (!Array.isArray(list)) return []
        return list.map(item => ({
            value: String(item.id),
            label: item[labelKey] || item.name || item.title || item.symbol || `ID ${item.id}`,
            original: item
        }))
    }

    const fetchCatalogs = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const results = await Promise.allSettled([
                getCategories(),
                getSubcategories(),
                getBrands(),
                getUnits()
            ])

            // [0]=Categories, [1]=Subcategories, [2]=Brands, [3]=Units
            const [catRes, subRes, brandRes, unitRes] = results

            const newCatalogs = {
                categories: [],
                subcategories: [],
                brands: [],
                units: []
            }

            if (catRes.status === 'fulfilled') {
                const raw = normalize(catRes.value)
                newCatalogs.categories = mapToOptions(raw)
            }

            if (subRes.status === 'fulfilled') {
                const raw = normalize(subRes.value)
                newCatalogs.subcategories = mapToOptions(raw) // Keep all, filter in UI
            }

            if (brandRes.status === 'fulfilled') {
                const raw = normalize(brandRes.value)
                newCatalogs.brands = mapToOptions(raw)
            }

            if (unitRes.status === 'fulfilled') {
                const raw = normalize(unitRes.value)
                newCatalogs.units = mapToOptions(raw, 'symbol') // Units often have 'symbol' or 'name'
            }

            setCatalogs(newCatalogs)

            // Optional: Check if any critical catalog failed and set error
            if (results.some(r => r.status === 'rejected')) {
                console.warn('Some catalogs failed to load', results)
                setError('Algunos catálogos no se cargaron correctamente.')
            }

        } catch (err) {
            console.error('Error loading catalogs', err)
            setError('Error de conexión al cargar catálogos.')
            toast.push(
                <Notification title="Error" type="danger">
                    No se pudieron cargar los listados necesarios.
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCatalogs()
    }, [fetchCatalogs])

    return {
        ...catalogs,
        loading,
        error,
        retry: fetchCatalogs
    }
}

export default useCatalogs
