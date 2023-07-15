import React from "react"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"

import Navbar from "../Navbar"

const Events = () => {
  const token = Cookies.get("token")

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-main">
        <div>
          <h1>Events</h1>
        </div>
      </div>
    </div>
  )
}

export default Events
