import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'catalogue/subcategories/state',
    initialState: {
        deleteConfirmation: false,
        selectedSubcategory: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedSubcategory: (state, action) => {
            state.selectedSubcategory = action.payload
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
    setSelectedSubcategory,
    setDrawerOpen, 
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer
