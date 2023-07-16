import React, { useState, useEffect, useRef } from "react"

import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"

import "./index.css"

import Navbar from "../Navbar"
import PieChart from "../PieChart"
import BarChart from "../BarChart"

const AdminDashboard = () => {
  const token = Cookies.get("token")
  const [tasks, setTasks] = useState([])
  const [weekData, setWeekData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchTasks = React.useRef(null)

  if (!token) {
    return <Navigate to="/login" />
  }

  //fetch aLL user's tasks
  useEffect(() => {
    setLoading(true)
    fetchTasks.current = async () => {
      const api = `http://localhost:5000/api/tasks/all`
      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setTasks(data.tasks)

      if (response.ok) {
        setLoading(false)
      }
    }
    fetchTasks.current()
  }, [])

  //fetch weekly tasks data
  useEffect(() => {
    setLoading(true)
    fetchTasks.current = async () => {
      const api = `http://localhost:5000/api/tasks/weekly`
      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setWeekData(data.weekData)
    }
    fetchTasks.current()
  }, [])

  return (
    <div className="home-container">
      <Navbar />
      <div className="dashboard-container home-main">
        <div>
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-content">
          <PieChart tasks={tasks} />
          <BarChart weekData={weekData} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
