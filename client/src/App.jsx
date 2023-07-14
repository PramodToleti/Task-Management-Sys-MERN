import { BrowserRouter, Route, Routes } from "react-router-dom"
import AnimatedRoutes from "./components/AnimatedRoutes"
import { Toaster } from "react-hot-toast"

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
