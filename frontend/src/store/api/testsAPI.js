import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios";


export const testAPI = createApi({
    reducerPath: 'testsApi',
    baseQuery: axiosBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKENED_API_URL}/test`,
    }),
    tagTypes: ['Tests'],
    endpoints: (builder) => ({
        createTest: builder.mutation({
            query: ({groupId, formData}) => ({
                url: `/upload?groupId=${groupId}`,
                method: 'POST',
                data: formData
            }),
            invalidatesTags: ['Tests']
        }),
        viewAllTest: builder.query({
            query: () => ({
                url: "/",
                method: 'GET'
            }),
            providesTags: ['Tests']
        }),
        TeacherAllTests: builder.query({
            query: () => ({
                url: "/teacher",
                method: 'GET'
            }),
            providesTags: ['Tests']
        }),
        teacherviewTest: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Tests', id }]
        }),
        studentViewTest: builder.query({
            query: (id) => ({
                url: `/${id}/student`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Tests', id }]
        }),
        viewResult: builder.query({
            query: (id) => ({
                url: `/result/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Tests', id }]
        }),
        sendMessage: builder.mutation({
            query: (testId) => ({
                url: `/${testId}/send-message`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, testId) => [{ type: 'Tests', id: testId }]
        })
    })
})

export const { 
    useCreateTestMutation, 
    useViewAllTestQuery, 
    useTeacherAllTestsQuery, 
    useTeacherviewTestQuery, 
    useViewResultQuery,
    useStudentViewTestQuery,
    useSendMessageMutation
 } = testAPI;