import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiSearchProducts, apiCreateProduct } from 'services/catalogue/ProductService'

export const SLICE_NAME = 'products'

export const searchProducts = createAsyncThunk(
    SLICE_NAME + '/searchProducts',
    async (searchTerm) => {
        const response = await apiSearchProducts({ search: searchTerm })
        return response.data
    }
)

export const createProduct = createAsyncThunk(
    SLICE_NAME + '/createProduct',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiCreateProduct(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const initialState = {
    loadingSearch: false,
    searchResults: [],
    errorSearch: null,

    creating: false,
    createSuccess: false,
    errorCreate: null,
    createdProduct: null,
}

const productsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        resetSearchResults: (state) => {
            state.searchResults = []
            state.loadingSearch = false
            state.errorSearch = null
        },
        resetCreateState: (state) => {
            state.creating = false
            state.createSuccess = false
            state.errorCreate = null
            state.createdProduct = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Search Products
            .addCase(searchProducts.pending, (state) => {
                state.loadingSearch = true
                state.errorSearch = null
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loadingSearch = false
                state.searchResults = action.payload.data || action.payload
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loadingSearch = false
                state.errorSearch = action.error.message
            })

            // Create Product
            .addCase(createProduct.pending, (state) => {
                state.creating = true
                state.createSuccess = false
                state.errorCreate = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.creating = false
                state.createSuccess = true
                state.createdProduct = action.payload
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.creating = false
                state.createSuccess = false
                state.errorCreate = action.payload || action.error.message
            })
    },
})

export const { resetSearchResults, resetCreateState } = productsSlice.actions

export default productsSlice.reducer
