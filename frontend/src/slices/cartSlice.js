import { createSlice } from "@reduxjs/toolkit"
import { updateCart } from "../utils/cartUtils"

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" }

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // NOTE: we don't need user, rating, numReviews or reviews in the cart so we remove them from the item that is copy of product handled by action.payload
      const { user, rating, numReviews, reviews, ...item } = action.payload
      const existItem = state.cartItems.find((x) => x._id === item._id)

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        )
      } else {
        state.cartItems = [...state.cartItems, item] // if not existing item, it will copy an array an adds item to it, item is action to addToCart reducer
      }

      return updateCart(state)
    },

    removeFromCard: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)

      return updateCart(state)
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload

      return updateCart(state)
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload

      return updateCart(state)
    },

    clearCartItems: (state, action) => {
      state.cartItems = []
      return updateCart(state)
    },

    resetCart: (state) => {
      state.cartItems = []
      state.shippingAddress = {}
      state.paymentMethod = "PayPal"
      return updateCart(state)
    },
  },
})

export const {
  addToCart,
  removeFromCard,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions

export default cartSlice.reducer
