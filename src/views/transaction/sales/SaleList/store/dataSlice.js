import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSales,
    apiDeleteSale,
    apiGetSalesOpening
} from 'services/transaction/SaleService'
import { apiGetOpeningCurrent } from 'services/transaction/OpeningService'

export const getSales = createAsyncThunk(
    'transaction/sales/getSales',
    async () => {
        const response = await apiGetSales()
        return response.data
    }
)

export const getSalesOpening = createAsyncThunk(
    'transaction/sales/getSalesOpening',
    async (id) => {
        const response = await apiGetSalesOpening(id)
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

export const getOpeningCurrent = createAsyncThunk(
    'transaction/openings/getOpeningCurrent',
    async () => {
        const response = await apiGetOpeningCurrent()
        return response.data
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
        openingData: {}
    },
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setLoading: (state, action) => {
            console.log(action.payload);
            state.loading = action.payload
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
        },
        [getSalesOpening.fulfilled]: (state, action) => {
            state.saleList = action.payload.data.sales
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getSalesOpening.pending]: (state) => {
            state.loading = true
        },
        [getOpeningCurrent.fulfilled]: (state, action) => {
            state.openingData = action.payload.data
        },
        [getOpeningCurrent.rejected]: (state, action) => {
            state.openingData = {}
        }
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
