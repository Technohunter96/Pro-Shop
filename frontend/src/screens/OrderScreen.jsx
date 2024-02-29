import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import Message from "../components/Message"
import Loader from "../components/Loader"
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice"

const OrderScreen = () => {
  const { id: orderId } = useParams()

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId)

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation() // to change the order status to paid

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation() // to change the order status to delivered (possible only for admin)

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer() // to load the PayPal script

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery() // to get the PayPal client id

  const { userInfo } = useSelector((state) => state.auth) // to get the user info

  // to load the PayPal script and set the client id from the server
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
          },
          currency: "USD",
        })
        paypalDispatch({ type: "setLoadingStatus", value: "pending" })
      }
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript()
        }
      }
    }
  }, [order, paypal, paypalDispatch, errorPayPal, loadingPayPal])

  // to handle the payment success event from PayPal button component and update the order status to paid
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }) // from mutation
        refetch() // to update the order status (isPaid = true)
        toast.success("Payment successful!")
      } catch (err) {
        toast.error(err?.data?.message || err.message)
      }
    })
  }

  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } })
  //   refetch()
  //   toast.success("Test Payment successful!")
  // }

  function onError(err) {
    toast.error(err.message)
  }

  // to create the order object for PayPal button component
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId
      })
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId) // from mutation
      refetch() // to update the order status (isDelivered = true)
      toast.success("Order delivered!")
    } catch (err) {
      toast.error(err?.data?.message || err.message)
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = $
                      {(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* PAYPAL BUTTONS */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
