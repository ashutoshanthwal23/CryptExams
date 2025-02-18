import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios";

export const groupsAPI = createApi({
    reducerPath: "groupsAPI",
    baseQuery: axiosBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKENED_API_URL}/groups`,
    }),
    tagTypes: ['Groups'],
    endpoints: (builder) => ({
        createGroup: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                data: data
            }),
            invalidatesTags: ['Groups']
        }),
        showGroups: builder.query({
            query: () => ({
                url: "/",
                method: 'GET'
            }),
            providesTags: ['Groups']
        }),
        showGroup: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Groups', id }]
        }),
        addStudent: builder.mutation({
            query: ({groupId, user}) => ({
                url: `/${groupId}/student`,
                method: 'POST',
                data: user
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: 'Groups', id: groupId }]
        }),
        removeStudent: builder.mutation({
            query: ({groupId, studentId}) => ({
                url: `/${groupId}/student/${studentId}`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: 'Groups', id: groupId }]
        }),
        getStudentGroups: builder.query({
            query: () => ({
                url: "/enrolled",
                method: 'GET'
            }),
            providesTags: ['Groups']
        })
    })
})

export const { 
    useCreateGroupMutation, 
    useShowGroupsQuery, 
    useShowGroupQuery, 
    useAddStudentMutation, 
    useRemoveStudentMutation,
    useGetStudentGroupsQuery
 } = groupsAPI;