import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSale } from 'services/transaction/SaleService'

export const getSale = createAsyncThunk(
    'transaction/sales/getSale',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetSale(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const printSlice = createSlice({
    name: 'transaction/sales/print',
    initialState: {
        saleData: {},
        loading: false,
        printDialogOpen: false
    },
    reducers: {
        setPrintDialogOpen: (state, action) => {
            state.printDialogOpen = action.payload
        }
    },
    extraReducers: {
        [getSale.fulfilled]: (state, action) => {
            state.saleData = action.payload.data
        }
    }
})

export const { 
    setPrintDialogOpen,
} = printSlice.actions

export default printSlice.reducer
