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

const stateSlice = createSlice({
    name: 'transaction/sales/state',
    initialState: {
        deleteConfirmation: false,
        selectedSale: {},
        showDialogOpen: false
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedSale: (state, action) => {
            state.selectedSale = action.payload
        },
        setShowDialogOpen: (state, action) => {
            state.showDialogOpen = action.payload
        }
    },
    extraReducers: {
        [getSale.fulfilled]: (state, action) => {
            state.selectedSale = action.payload.data
        }
    }
})

export const { 
    toggleDeleteConfirmation, 
    setSelectedSale,
    setShowDialogOpen
} = stateSlice.actions

export default stateSlice.reducer
