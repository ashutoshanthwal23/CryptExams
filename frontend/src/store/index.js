import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from './api/authAPI';
import { userReducer } from './reducers/userReducer';
import { groupsAPI } from './api/groupsAPI';
import { testAPI } from './api/testsAPI';

export const store = configureStore({
    reducer: {
        [userReducer.name]: userReducer.reducer,
        [authAPI.reducerPath]: authAPI.reducer,
        [groupsAPI.reducerPath]: groupsAPI.reducer,
        [testAPI.reducerPath]: testAPI.reducer
    },
    middleware: (getDefaultMiddleware) => 
        [...getDefaultMiddleware(), authAPI.middleware, groupsAPI.middleware, testAPI.middleware]
})

























