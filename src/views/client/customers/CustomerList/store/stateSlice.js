import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'client/customers/state',
    initialState: {
        deleteConfirmation: false,
        selectedCustomer: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedCustomer: (state, action) => {
            state.selectedCustomer = action.payload
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
    setSelectedCustomer,
    setDrawerOpen, 
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer
