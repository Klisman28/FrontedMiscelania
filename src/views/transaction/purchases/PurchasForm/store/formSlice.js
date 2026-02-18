import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSuppliers } from 'services/organization/SupplierService'
import { apiSearchProducts, apiGetProducts } from 'services/catalogue/ProductService'
import { apiGetSubcategories } from 'services/catalogue/SubcategoryService'
import { apiGetBrands } from 'services/catalogue/BrandService'
import { apiGetCategories } from 'services/catalogue/CategoryService'
import warehouseService from 'services/warehouseService'

export const getSuppliers = createAsyncThunk(
    'transaction/purchases/getSuppliers',
    async () => {
        const response = await apiGetSuppliers()
        return response.data
    }
)

export const searchProducts = createAsyncThunk(
    'transaction/purchases/searchProducts',
    async (query) => {
        const response = await apiSearchProducts(query)
        return response.data
    }
)

// Todos los productos (sin filtro)
export const getAllProducts = createAsyncThunk(
    'transaction/purchases/getAllProducts',
    async () => {
        const response = await apiGetProducts()
        return response.data
    }
)

// Stock de una bodega específica → GET /warehouses/{id}/stock
// Devuelve los productos que tienen stock en esa bodega
export const getProductsByWarehouse = createAsyncThunk(
    'transaction/purchases/getProductsByWarehouse',
    async (warehouseId) => {
        const response = await warehouseService.fetchWarehouseStock(warehouseId, {})
        return response.data
    }
)

export const getSubcategories = createAsyncThunk(
    'transaction/purchases/getSubcategories',
    async () => {
        const response = await apiGetSubcategories()
        return response.data
    }
)

export const getBrands = createAsyncThunk(
    'transaction/purchases/getBrands',
    async () => {
        const response = await apiGetBrands()
        return response.data
    }
)

export const getCategories = createAsyncThunk(
    'transaction/purchases/getCategories',
    async () => {
        const response = await apiGetCategories()
        return response.data
    }
)

const newSlice = createSlice({
    name: 'transaction/purchases/data',
    initialState: {
        supplierList: [],
        productList: [],
        searchTerm: '',
        catalogue: {
            categories: [],
            subcategories: [],
            brands: [],
            products: [],
            loading: false,
        }
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        },
    },
    extraReducers: {
        [getSuppliers.fulfilled]: (state, action) => {
            state.supplierList = action.payload.data.suppliers
        },
        [searchProducts.fulfilled]: (state, action) => {
            state.productList = action.payload.data
        },
        // ── Todos los productos ──────────────────────────────
        [getAllProducts.pending]: (state) => {
            state.catalogue.loading = true
        },
        [getAllProducts.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.products = payload?.data?.products ?? payload?.products ?? []
            state.catalogue.loading = false
        },
        [getAllProducts.rejected]: (state) => {
            state.catalogue.loading = false
        },
        // ── Stock por bodega ─────────────────────────────────
        // GET /warehouses/{id}/stock devuelve items de stock con
        // el producto embebido: { product: {...}, quantity, ... }
        [getProductsByWarehouse.pending]: (state) => {
            state.catalogue.loading = true
            state.catalogue.products = []
        },
        [getProductsByWarehouse.fulfilled]: (state, action) => {
            const payload = action.payload
            // El endpoint /warehouses/{id}/stock devuelve:
            // { data: [ { product: {...}, quantity: N, ... }, ... ] }
            // Normalizamos para que cada item sea el producto con su stock
            const rawItems = payload?.data ?? payload ?? []
            const items = Array.isArray(rawItems) ? rawItems : []

            state.catalogue.products = items.map(item => {
                // Si el item ya es un producto (tiene .name directamente)
                if (item.name) return item
                // Si es un item de stock con .product embebido
                const product = item.product ?? item
                return {
                    ...product,
                    stock: item.quantity ?? item.stock ?? product.stock ?? 0,
                }
            })
            state.catalogue.loading = false
        },
        [getProductsByWarehouse.rejected]: (state) => {
            state.catalogue.products = []
            state.catalogue.loading = false
        },
        // ── Catálogos auxiliares ─────────────────────────────
        [getSubcategories.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.subcategories = Array.isArray(payload) ? payload : (payload.data || payload.subcategories || [])
        },
        [getBrands.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.brands = Array.isArray(payload) ? payload : (payload.data || payload.brands || [])
        },
        [getCategories.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.categories = Array.isArray(payload) ? payload : (payload.data || payload.categories || [])
        },
    }
})

export const { setSearchTerm } = newSlice.actions

export default newSlice.reducer
