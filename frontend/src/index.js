import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { HelmetProvider } from "react-helmet-async"
import { Provider } from "react-redux"
import store from "./store"
// Bootstrap
import "./assets/styles/bootstrap.custom.css"
import "./assets/styles/index.css"
// PrivateRoute
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
// Screens
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen"
import CartScreen from "./screens/CartScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import ShippingScreen from "./screens/ShippingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import PlaceOrderScreen from "./screens/PlaceOrderScreen"
import OrderScreen from "./screens/OrderScreen"
import ProfileScreen from "./screens/ProfileScreen"
// Admin Screens
import OrderListScreen from "./screens/admin/OrderListScreen"
import ProductListScreen from "./screens/admin/ProductListScreen"
import ProductEditScreen from "./screens/admin/ProductEditScreen"
import UserListScreen from "./screens/admin/UserListScreen"
import UserEditScreen from "./screens/admin/UserEditScreen"

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      {/* NOTE: PrivateRoute is a component that checks if the user is logged in, if not, it redirects to the login page */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route
          path="/admin/productlist/:pageNumber"
          element={<ProductListScreen />}
        />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={routes} />
      </PayPalScriptProvider>
    </Provider>
  </HelmetProvider>
)

reportWebVitals()
