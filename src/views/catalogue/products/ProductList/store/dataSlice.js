import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetProducts,
    apiDeleteProduct,
    apiUpdateProductStatus,
} from 'services/catalogue/ProductService'
import { toast, Notification } from 'components/ui'

export const getProducts = createAsyncThunk(
    'catalogue/products/getProducts',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { status } = getState().productList.data.filters
            const params = { status }

            const response = await apiGetProducts(params)
            return response.data
        } catch (error) {
            toast.push(
                <Notification title="Error de carga" type="danger" duration={5000}>
                    {error.response?.data?.message || 'Hubo un error al intentar cargar los productos'}
                </Notification>,
                { placement: 'top-center' }
            )
            return rejectWithValue(error.response?.data || error)
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'catalogue/products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteProduct(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateProductStatus = createAsyncThunk(
    'catalogue/products/updateProductStatus',
    async ({ id, status, reason }, { rejectWithValue }) => {
        try {
            const response = await apiUpdateProductStatus(id, { status, reason })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error desconocido' })
        }
    }
)

export const initialTableData = {
    total: 0,
    initialPageIndex: 0,
    initialPageSize: 5,
}

const dataSlice = createSlice({
    name: 'catalogue/products/data',
    initialState: {
        loading: false,
        productList: [],
        tableData: initialTableData,
        filters: {
            status: 'ACTIVE',
        },
    },
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        updateProductInList: (state, action) => {
            const updated = action.payload
            const idx = state.productList.findIndex(p => p.id === updated.id)
            if (idx !== -1) {
                state.productList[idx] = { ...state.productList[idx], ...updated }
            }
        }
    },
    extraReducers: {
        [getProducts.fulfilled]: (state, action) => {
            state.productList = action.payload.data.products
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getProducts.pending]: (state) => {
            state.loading = true
        },
        [getProducts.rejected]: (state) => {
            state.loading = false
            state.productList = []
        }
    }
})

export const { setTableData, setLoading, setFilters, updateProductInList } = dataSlice.actions

export default dataSlice.reducer
