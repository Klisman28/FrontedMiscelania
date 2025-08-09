import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetPurchases,
    apiDeletePurchas
} from 'services/transaction/PurchasService'

export const getPurchases = createAsyncThunk(
    'transaction/purchases/getPurchases',
    async () => {
        const response = await apiGetPurchases()
        return response.data
    }
)

export const deletePurchas = createAsyncThunk(
    'transaction/purchases/deletePurchas',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeletePurchas(id)
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
    name: 'transaction/purchases/data',
    initialState: {
        loading: false,
        purchasList: [],
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
        [getPurchases.fulfilled]: (state, action) => {
            state.purchasList = action.payload.data.purchases
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getPurchases.pending]: (state) => {
            state.loading = true
        }
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
