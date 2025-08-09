
import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'client/enterprises/state',
    initialState: {
        deleteConfirmation: false,
        selectedEnterprise: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedEnterprise: (state, action) => {
            state.selectedEnterprise = action.payload
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
    setSelectedEnterprise,
    setDrawerOpen,
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer