import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetPurchas } from 'services/transaction/PurchasService'

export const getPurchas = createAsyncThunk(
    'transaction/purchases/getPurchas',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetPurchas(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const stateSlice = createSlice({
    name: 'transaction/purchases/state',
    initialState: {
        deleteConfirmation: false,
        selectedPurchas: {},
        showDialogOpen: false
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedPurchas: (state, action) => {
            state.selectedPurchas = action.payload
        },
        setShowDialogOpen: (state, action) => {
            state.showDialogOpen = action.payload
        }
    },
    extraReducers: {
        [getPurchas.fulfilled]: (state, action) => {
            state.selectedPurchas = action.payload.data
        }
    }
})

export const { 
    toggleDeleteConfirmation, 
    setSelectedPurchas,
    setShowDialogOpen
} = stateSlice.actions

export default stateSlice.reducer
