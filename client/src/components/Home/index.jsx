import React from "react"
import { Navigate } from "react-router-dom"
import Cookies from "js-cookie"

import Navbar from "../Navbar"

import "./index.css"
import TaskHeader from "../TaskHeader"

const Home = () => {
  const [activeTitle, setActiveTitle] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState([])
  const token = Cookies.get("token")
  if (!token) {
    return <Navigate to="/login" />
  }

  const userDetails = JSON.parse(localStorage.getItem("user"))
  const { name } = userDetails

  const handleSearchTitle = (e) => {
    setActiveTitle(e)
  }

  const handleActiveFilters = (e, checked) => {
    if (checked) {
      setActiveFilters([...activeFilters, e])
    } else {
      setActiveFilters((prev) => prev.filter((item) => item !== e))
    }
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-main">
        <div className="greeting-container">
          <p className="greeting-msg">Hi {name.split(" ")[0]},</p>
          <h1>
            Welcome Back <span className="wave">👋🏻</span>
          </h1>
        </div>
        <div className="task-container">
          <TaskHeader
            handleSearchTitle={handleSearchTitle}
            handleActiveFilters={handleActiveFilters}
            activeFilters={activeFilters}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
