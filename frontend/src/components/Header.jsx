import { useNavigate } from "react-router-dom"
import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import { LinkContainer } from "react-router-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useLogoutMutation } from "../slices/usersApiSlice"
import { logout } from "../slices/authSlice"
import logo from "../assets/logo.png"

function Header() {
  const { cartItems } = useSelector((state) => state.cart) // from cart in store
  const { userInfo } = useSelector((state) => state.auth) // from auth in store

  const [logoutApiCall] = useLogoutMutation() // destructuring the logout mutation

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap() // calling the logout mutation
      dispatch(logout()) // dispatching the logout action to set userInfo to null
      navigate("/login")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="ProShop" />
              ProShop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce((acc, cur) => acc + cur.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {/* if userInfo is not null, show the user name and a dropdown with profile and logout, otherwise show sign in */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
