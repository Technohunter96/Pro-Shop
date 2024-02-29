import express from "express"
const router = express.Router()
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from "../controller/orderController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders)
router.get("/myorders", protect, getMyOrders)
router.get("/:id", protect, getOrderById)
router.put("/:id/pay", protect, updateOrderToPaid)
router.put("/:id/deliver", protect, admin, updateOrderToDelivered)

export default router
