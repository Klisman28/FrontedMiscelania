import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    avatar: '',
    username: '',
    owner: '',
    authority: [],
    subscriptionStatus: 'active' // Default to active to prevent blocking legacy users
}

export const userSlice = createSlice({
    name: 'auth/user',
    initialState,
    reducers: {
        setUser: (_, action) => action.payload,
        userLoggedOut: () => initialState,
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer