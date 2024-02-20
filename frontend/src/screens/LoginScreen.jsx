import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader"
import { useLoginMutation } from "../slices/usersApiSlice.js"
import { setCredentials } from "../slices/authSlice.js"
import { toast } from "react-toastify"

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation() // login is a function, isLoading is a boolean that is true when the mutation is in progress

  const { userInfo } = useSelector((state) => state.auth) // getting userInfo from the store, that is null by default

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get("redirect") || "/"

  useEffect(() => {
    // if userInfo is not null, redirect to the redirect path
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      // calling the login mutation to send the email and password to the server and getting the response. unwrap() is used to get the actual data from the res
      const res = await login({ email, password }).unwrap()
      // setting the credentials in the store and local storage to whatever the user is
      dispatch(setCredentials({ ...res }))
      navigate(redirect)
    } catch (err) {
      // ? means if there is an error, get the message from the error, otherwise get the message from the data, even if err is undefined we get the message
      toast.error(err?.data?.message || err?.error)
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Sign In
        </Button>

        {isLoading && <Loader />}

        <Row className="py-3">
          <Col>
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default LoginScreen
