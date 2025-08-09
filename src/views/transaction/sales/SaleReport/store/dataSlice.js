import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSales,
    apiDeleteSale
} from 'services/transaction/SaleService'

export const getSales = createAsyncThunk(
    'transaction/sales/getSales',
    async () => {
        const response = await apiGetSales()
        return response.data
    }
)

export const deleteSale = createAsyncThunk(
    'transaction/sales/deleteSale',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteSale(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const initialTableData = {
    total: 0,
    initialPageIndex: 0,
    initialPageSize: 5,
}

const dataSlice = createSlice({
    name: 'transaction/sales/data',
    initialState: {
        loading: false,
        saleList: [],
        tableData: initialTableData,
    },
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        }
    },
    extraReducers: {
        [getSales.fulfilled]: (state, action) => {
            state.saleList = action.payload.data.sales
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getSales.pending]: (state) => {
            state.loading = true
        }
    }
})

export const { setTableData } = dataSlice.actions

export default dataSlice.reducer
