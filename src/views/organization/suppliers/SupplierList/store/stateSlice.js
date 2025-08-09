
import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'organization/suppliers/state',
    initialState: {
        deleteConfirmation: false,
        selectedSupplier: {},
        drawerOpen: false,
        actionForm: 'create'
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedSupplier: (state, action) => {
            state.selectedSupplier = action.payload
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
    setSelectedSupplier,
    setDrawerOpen,
    setDrawerClose,
    setActionForm,
} = stateSlice.actions

export default stateSlice.reducer