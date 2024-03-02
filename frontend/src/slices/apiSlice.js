import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../constants"

import { logout } from "./authSlice" // Import the logout action

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL })

// NOTE: code here has changed to handle when our JWT and Cookie expire.
// We need to customize the baseQuery to be able to intercept any 401 responses
// and log the user out
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-queries-with-basequery

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra)
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(logout())
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth, // Use the customized baseQuery
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({}),
})

// apiSlice is the mother of all slices in this app that are included in tagTypes: ["Product", "Order", "User"]. It is used to create a slice for making API requests. The baseQuery is used to set the base URL for the API requests. The tagTypes array is used to define the types of data that the API will return. The endpoints object is used to define the API endpoints. In this case, the endpoints object is empty because the endpoints will be defined in the individual slice files. The apiSlice object is then exported to be used in the store.js file.
