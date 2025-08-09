
import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'organization/users/state',
    initialState: {
        deleteConfirmation: false,
        selectedUser: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
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
    setSelectedUser,
    setDrawerOpen,
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer