import React from "react"
import { Navigate } from "react-router-dom"
import Cookies from "js-cookie"
import { CgOptions } from "react-icons/cg"

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
          <div className="task-list-container">
            <div className="task-card">
              <div className="task-card-header">
                <div>
                  <h2>Task Heading for testing the task card</h2>
                </div>
                <div>
                  <p className="task-status"> • Pending</p>
                  <CgOptions className="edit-icon" />
                </div>
              </div>

              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque,
                molestiae officia! Dolore quaerat natus molestiae voluptate
                nobis fugit repellendus! Eveniet explicabo odio ad qui iure sunt
                ipsam sapiente nesciunt temporibus.
              </p>
              <p>Due Date: </p>
              <div className="task-card-footer">
                <div>
                  <div className="task-profile-icon">U</div>
                  <div className="task-profile-icon">PT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
