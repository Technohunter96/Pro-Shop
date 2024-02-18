import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL }); // dev: localhost:5000

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({}),
});

// apiSlice is the mother of all slices in this app. It is used to create a slice for making API requests. The baseQuery is used to set the base URL for the API requests. The tagTypes array is used to define the types of data that the API will return. The endpoints object is used to define the API endpoints. In this case, the endpoints object is empty because the endpoints will be defined in the individual slice files. The apiSlice object is then exported to be used in the store.js file.
