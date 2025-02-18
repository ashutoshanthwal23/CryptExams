import { createSlice } from "@reduxjs/toolkit";

export const userReducer = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        userInfo: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.isLoggedIn = true;
            state.userInfo = action.payload;
        },
        removeUser: (state) => {
            state.isLoggedIn = false;
            state.userInfo = null
        }
    }
})

export const { setUser, removeUser } = userReducer.actions;