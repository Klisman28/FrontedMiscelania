import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetCashiers,
    apiDeleteCashier,
    apiPostCashier,
    apiPutCashier
} from 'services/transaction/CashierService'

export const getCashiers = createAsyncThunk(
    'transaction/cashiers/getCashiers',
    async () => {
        const response = await apiGetCashiers()
        return response.data
    }
)

export const postCashier = createAsyncThunk(
    'transaction/cashiers/postCashier',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostCashier(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putCashier = createAsyncThunk(
    'transaction/cashiers/putCashier',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutCashier(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteCashier = createAsyncThunk(
    'transaction/cashiers/deleteCashier',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteCashier(id)
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
    name: 'transaction/cashiers/data',
    initialState: {
        loading: false,
        cashierList: [],
        tableData: initialTableData,
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
        [getCashiers.fulfilled]: (state, action) => {
            state.cashierList = action.payload.data.cashiers
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getCashiers.pending]: (state) => {
            state.loading = true
        },
        [postCashier.fulfilled]: (state) => {
            state.loading = false
        },
        [postCashier.pending]: (state) => {
            state.loading = true
        },
        [postCashier.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
