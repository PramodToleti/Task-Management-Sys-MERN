import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"

import Login from "../Login"
import SignUp from "../SignUp"
import Home from "../Home"

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default AnimatedRoutes
