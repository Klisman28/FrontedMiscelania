import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'catalogue/categories/state',
    initialState: {
        deleteConfirmation: false,
        selectedCategory: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
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
    setSelectedCategory,
    setDrawerOpen, 
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer
