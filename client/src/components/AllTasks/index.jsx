import React from "react"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"

import Navbar from "../Navbar"
import TaskHeader from "../TaskHeader"

const AllTasks = () => {
  const [activeTitle, setActiveTitle] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState([])
  const token = Cookies.get("token")

  if (!token) {
    return <Navigate to="/login" />
  }

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
        <div>
          <h1>All Tasks</h1>
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

export default AllTasks
