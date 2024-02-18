import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // activate Redux DevTools
});

export default store;

// The store.js file is used to create the Redux store. The store is created using the configureStore function from the @reduxjs/toolkit package. The apiSlice object is used as a reducer in the store, and the apiSlice.middleware is added to the middleware of the store. The store is then exported to be used in the index.js file.
