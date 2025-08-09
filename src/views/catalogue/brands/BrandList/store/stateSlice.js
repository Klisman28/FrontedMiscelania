import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'catalogue/brands/state',
    initialState: {
        deleteConfirmation: false,
        selectedBrand: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedBrand: (state, action) => {
            state.selectedBrand = action.payload
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false
        },
        setActionForm: (state, action) => {
            state.actionForm = action.payload
        }
    },
})

export const { 
    toggleDeleteConfirmation, 
    setSortedColumn,
    setSelectedBrand,
    setDrawerOpen, 
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer
