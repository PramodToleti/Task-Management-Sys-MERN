import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import { toast } from "react-hot-toast"
import Tippy from "@tippyjs/react"
import Popup from "reactjs-popup"
import { CgOptions } from "react-icons/cg"
import TaskForm from "../TaskForm"

import "./index.css"

import Navbar from "../Navbar"
import PieChart from "../PieChart"
import BarChart from "../BarChart"
import TaskHeader from "../TaskHeader"

const AdminDashboard = () => {
  const [activeTitle, setActiveTitle] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState([])
  const [edit, toggleEdit] = React.useState(false)
  const [activeEdit, setActiveEdit] = React.useState(null)
  const [tasks, setTasks] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [btnLoad, setBtnLoad] = React.useState(false)
  const fetchTasks = React.useRef(null)
  const fetchWeekData = React.useRef(null)
  const editRef = React.useRef(null)
  const updateRef = React.useRef(null)
  const token = Cookies.get("token")
  const [weekData, setWeekData] = useState([])
  const [activeOption, setActiveOption] = useState("tasks")

  if (!token) {
    return <Navigate to="/login" />
  }

  //close edit when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log(editRef.current)
      if (editRef.current && editRef.current !== event.target) {
        toggleEdit(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editRef])

  //fetch aLL user's tasks
  useEffect(() => {
    setLoading(true)
    fetchTasks.current = async () => {
      const api = `https://tasks-server-backend.onrender.com/api/tasks/all`
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
    fetchWeekData.current = async () => {
      const api = `https://tasks-server-backend.onrender.com/api/tasks/weekly`
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
    fetchWeekData.current()
  }, [])

  //Update task
  const handleTaskData = async (data) => {
    setBtnLoad(true)
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(
      `https://tasks-server-backend.onrender.com/api/tasks/update/${data.id}`,
      options
    )
    const json = await response.json()
    if (response.ok) {
      setBtnLoad(false)
      toast.success("Task Updated")
      updateRef.current.close()
      fetchTasks.current()
      fetchWeekData.current()
    } else {
      setBtnLoad(false)
      toast.error(json.message)
    }
  }

  //Delete task
  const deleteTask = async (task) => {
    if (
      task.createdBy !== JSON.parse(localStorage.getItem("user")).name &&
      JSON.parse(localStorage.getItem("user")).role !== "admin"
    ) {
      toast.error(
        "You can't delete this task. Please contact the user who created this task."
      )
    } else {
      setBtnLoad(true)
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await fetch(
        `https://tasks-server-backend.onrender.com/api/tasks/delete/${task._id}`,
        options
      )

      const json = await response.json()
      if (response.ok) {
        toast.success("Task Deleted")
        fetchTasks.current()
        setBtnLoad(false)
      } else {
        toast.error(json.message)
        setBtnLoad(false)
      }
    }
  }

  //Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (activeTitle === "" && activeFilters.length === 0) {
      return task
    } else if (
      task.title.toLowerCase().includes(activeTitle.toLowerCase()) &&
      activeFilters.length === 0
    ) {
      return task
    } else if (activeTitle === "" && activeFilters.length > 0) {
      if (activeFilters.includes("Today")) {
        const today = new Date()
        const dueDate = new Date(task.createdAt)
        return (
          dueDate.getDate() === today.getDate() &&
          dueDate.getMonth() === today.getMonth() &&
          dueDate.getFullYear() === today.getFullYear()
        )
      } else if (activeFilters.includes("Yesterday")) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const dueDate = new Date(task.dueDate)
        return (
          dueDate.getDate() === yesterday.getDate() &&
          dueDate.getMonth() === yesterday.getMonth() &&
          dueDate.getFullYear() === yesterday.getFullYear()
        )
      } else {
        return activeFilters.includes(task.status)
      }
    } else if (
      task.title.toLowerCase().includes(activeTitle.toLowerCase()) &&
      activeFilters.length > 0
    ) {
      return activeFilters.includes(task.status)
    } else {
      return null
    }
  })

  //Handling States
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

  const handleOption = (e) => {
    setActiveOption(e)
  }

  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "completed"
      case "In Progress":
        return "in-progress"
      case "Pending":
        return "pending"
      default:
        return ""
    }
  }

  console.log(activeFilters)

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-main">
        <div>
          <h1>Dashboard</h1>
        </div>
        {loading ? (
          <div className="loader-container">
            <Oval
              height={55}
              width={55}
              color="#000"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#fff"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : (
          <>
            <div className="dashboard-content">
              <TaskHeader
                handleSearchTitle={handleSearchTitle}
                handleActiveFilters={handleActiveFilters}
                activeFilters={activeFilters}
                fetchTasks={fetchTasks}
                handleOption={handleOption}
              />
              {filteredTasks.length === 0 && activeOption === "tasks" && (
                <div className="no-task-container">
                  <h2 className="no-task-msg">No Tasks Found ☹️</h2>
                </div>
              )}
              {activeOption === "tasks" ? (
                <>
                  <div className="task-list-container">
                    {filteredTasks.map((task, i) => (
                      <div className="task-card" key={task._id}>
                        <div className="task-card-header">
                          <div className="title-container">
                            <h2>{task.title}</h2>
                            <div
                              className={`task-status ${statusColor(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </div>
                          </div>
                          <div className="edit-container">
                            <CgOptions
                              className="edit-icon"
                              onClick={() => {
                                toggleEdit(!edit)
                                setActiveEdit(i)
                              }}
                            />

                            <div
                              className={`edit-popup-container ${
                                edit && activeEdit === i ? "display-edit" : ""
                              }`}
                              ref={editRef}
                            >
                              <Popup
                                modal
                                trigger={
                                  <button
                                    type="button"
                                    className="edit-popup-btn"
                                  >
                                    Edit
                                  </button>
                                }
                                ref={updateRef}
                              >
                                <TaskForm
                                  handleTaskData={handleTaskData}
                                  loading={btnLoad}
                                  type="edit"
                                  task={task}
                                />
                              </Popup>
                              <Popup
                                modal
                                trigger={
                                  <button
                                    type="button"
                                    className="edit-popup-btn"
                                  >
                                    Delete
                                  </button>
                                }
                                ref={updateRef}
                              >
                                <div className="delete-popup-container">
                                  <h3>
                                    Are you sure you want to delete this task?
                                  </h3>
                                  <div className="delete-popup-btn-container">
                                    <button
                                      type="button"
                                      className="delete-popup-btn"
                                      onClick={() => deleteTask(task)}
                                    >
                                      {btnLoad ? (
                                        <Oval
                                          height={15}
                                          width={15}
                                          color="#000"
                                          wrapperStyle={{}}
                                          wrapperClass=""
                                          visible={true}
                                          ariaLabel="oval-loading"
                                          secondaryColor="#fff"
                                          strokeWidth={2}
                                          strokeWidthSecondary={2}
                                        />
                                      ) : (
                                        "Yes"
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      className="delete-popup-btn"
                                      onClick={() => updateRef.current.close()}
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              </Popup>
                            </div>
                          </div>
                        </div>

                        <p>{task.description}</p>

                        <div className="task-card-footer">
                          <p>
                            Due:{" "}
                            {new Date(task.dueDate).toLocaleString("en-us", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                            })}
                          </p>

                          <div>
                            {task.assignedUser !== task.createdBy && (
                              <Tippy content={task.assignedUser}>
                                <div className="task-profile-icon-2">
                                  {task.assignedUser
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((item) => item[0].toUpperCase())}
                                </div>
                              </Tippy>
                            )}
                            <Tippy content={task.createdBy}>
                              <div className="task-profile-icon">
                                {task.createdBy
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((item) => item[0].toUpperCase())}
                              </div>
                            </Tippy>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="analytics-container">
                  <PieChart tasks={tasks} />
                  <BarChart weekData={weekData} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
