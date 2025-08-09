import { createSlice } from '@reduxjs/toolkit'

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
    }
})

export const { 
    toggleDeleteConfirmation, 
    setSelectedSale,
    setShowDialogOpen
} = stateSlice.actions

export default stateSlice.reducer
