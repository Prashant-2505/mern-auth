import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = false
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },


        updateUserStart: (state, action) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.error = false
        },
        updateUserFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },


        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            state.loading = false
            state.currentUser = null
            state.error = false
        },
        deleteUserFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },


        signoutUserStart: (state) => {
            state.loading = true
        },
        signoutUserSuccess: (state) => {
            state.loading = false
            state.currentUser = null
            state.error = false
        },
        signoutUserFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const { signInFailure, signInStart, signInSuccess, updateUserStart, updateUserSuccess, updateUserFailure,deleteUserStart, deleteUserSuccess, deleteUserFailure,signoutUserStart,signoutUserSuccess,signoutUserFailure } = userSlice.actions
export default userSlice.reducer