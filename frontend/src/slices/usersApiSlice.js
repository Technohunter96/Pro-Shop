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
  }),
})

export const { useLoginMutation } = usersApiSlice
