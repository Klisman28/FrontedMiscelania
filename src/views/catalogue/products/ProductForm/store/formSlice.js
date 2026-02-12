import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSubcategories } from 'services/catalogue/SubcategoryService'
import { apiGetBrands } from 'services/catalogue/BrandService'
import { apiGetProductUnits } from 'services/catalogue/ProductService'
import { apiGetCategories } from 'services/catalogue/CategoryService'

export const getSubategories = createAsyncThunk(
    'catalogue/products/getSubategories',
    async () => {
        const response = await apiGetSubcategories()
        return response.data
    }
)

export const getBrands = createAsyncThunk(
    'catalogue/products/getBrands',
    async () => {
        const response = await apiGetBrands()
        return response.data
    }
)

export const getProductUnits = createAsyncThunk(
    'catalogue/products/getProductUnits',
    async () => {
        const response = await apiGetProductUnits()
        return response.data
    }
)

export const getCategories = createAsyncThunk(
    'catalogue/products/getCategories',
    async () => {
        const response = await apiGetCategories()
        return response.data
    }
)

const newSlice = createSlice({
    name: 'catalogue/products/data',
    initialState: {
        subcategoryList: [],
        brandList: [],
        unitList: [],
        categoryList: [],
        loading: false,
    },
    reducers: {},
    extraReducers: {
        [getSubategories.pending]: (state) => {
            state.loading = true
        },
        [getSubategories.fulfilled]: (state, action) => {
            state.subcategoryList = action.payload.data?.subcategories || action.payload.subcategories || action.payload || []
            state.loading = false
        },
        [getSubategories.rejected]: (state) => {
            state.loading = false
        },

        [getBrands.pending]: (state) => {
            state.loading = true
        },
        [getBrands.fulfilled]: (state, action) => {
            state.brandList = action.payload.data?.brands || action.payload.brands || action.payload || []
            state.loading = false
        },
        [getBrands.rejected]: (state) => {
            state.loading = false
        },

        [getProductUnits.pending]: (state) => {
            state.loading = true
        },
        [getProductUnits.fulfilled]: (state, action) => {
            state.unitList = action.payload.data || action.payload || []
            state.loading = false
        },
        [getProductUnits.rejected]: (state) => {
            state.loading = false
        },

        [getCategories.pending]: (state) => {
            state.loading = true
        },
        [getCategories.fulfilled]: (state, action) => {
            state.categoryList = action.payload.data?.categories || action.payload.categories || action.payload || []
            state.loading = false
        },
        [getCategories.rejected]: (state) => {
            state.loading = false
        },
    }
})

export default newSlice.reducer
