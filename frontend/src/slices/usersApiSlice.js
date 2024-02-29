import { USERS_URL } from "../constants" // /api/users
import { apiSlice } from "./apiSlice"

// injecting endpoints to the (main)apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
})

// exporting the generated hooks that in name contain the endpoint name in the middle ("login" => useLoginMutation, logout => useLogoutMutation)
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  usersApiSlice
