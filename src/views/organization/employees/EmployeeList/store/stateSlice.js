import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'organization/employees/state',
    initialState: {
        deleteConfirmation: false,
        selectedEmployee: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedEmployee: (state, action) => {
            state.selectedEmployee = action.payload
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
    setSelectedEmployee,
    setDrawerOpen, 
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer
