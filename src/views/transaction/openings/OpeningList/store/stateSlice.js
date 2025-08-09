import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'transaction/openings/state',
    initialState: {
        deleteConfirmation: false,
        selectedOpening: {},
        drawerOpen: false,
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedOpening: (state, action) => {
            state.selectedOpening = action.payload
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false
        }
    },
})

export const { 
    toggleDeleteConfirmation, 
    setSortedColumn,
    setSelectedOpening,
    setDrawerOpen, 
    setDrawerClose,
} = stateSlice.actions

export default stateSlice.reducer
