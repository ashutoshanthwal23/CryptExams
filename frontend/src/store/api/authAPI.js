import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authAPI = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKENED_API_URL,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: "/auth/register",
                method: "POST",
                body: credentials
            })
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: 'POST'
            })
        }),
        self: builder.query({
            query: () => '/auth/self'
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: "POST"
            })
        })
        
    })
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useRefreshMutation, useSelfQuery } = authAPI;