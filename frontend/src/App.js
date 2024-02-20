import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./components/Header"
import Footer from "./components/Footer"

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet /> {/* Outlets of App Route of router in index.js */}
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
