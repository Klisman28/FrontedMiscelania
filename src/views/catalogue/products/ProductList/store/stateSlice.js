import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'catalogue/products/state',
    initialState: {
        deleteConfirmation: false,
        selectedProduct: {},
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
    },
})

export const { 
    toggleDeleteConfirmation, 
    setSortedColumn,
    setSelectedProduct,
    setDrawerOpen, 
    setDrawerClose
} = stateSlice.actions

export default stateSlice.reducer
