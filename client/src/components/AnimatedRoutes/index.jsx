import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"

import Login from "../Login"
import SignUp from "../SignUp"
import Home from "../Home"
import AllTasks from "../AllTasks"
import AdminDashboard from "../AdminDashboard"
import AssignedToMe from "../AssignedToMe"
import Events from "../Events"

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Home />} />
      {/* <Route path="/all-tasks" element={<AllTasks />} /> */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/assigned-to-me" element={<AssignedToMe />} />
      <Route path="/events" element={<Events />} />
    </Routes>
  )
}

export default AnimatedRoutes
