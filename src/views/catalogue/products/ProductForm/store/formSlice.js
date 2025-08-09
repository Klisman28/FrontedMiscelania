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
        categoryList: [], // <-- Nuevo array donde guardarás las categorías

    },
    reducers: {},
    extraReducers: {
        [getSubategories.fulfilled]: (state, action) => {
            state.subcategoryList = action.payload.data.subcategories
        },
        [getBrands.fulfilled]: (state, action) => {
            state.brandList = action.payload.data.brands
        },
        [getProductUnits.fulfilled]: (state, action) => {
            state.unitList = action.payload.data
        },

        [getCategories.fulfilled]: (state, action) => {
            state.categoryList = action.payload.data.categories 
        },
    }
})

export default newSlice.reducer
