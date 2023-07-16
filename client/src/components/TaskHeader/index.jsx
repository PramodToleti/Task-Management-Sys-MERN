import React from "react"
import { FiSearch, FiFilter, FiPlus } from "react-icons/fi"
import Popup from "reactjs-popup"
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { toast } from "react-hot-toast"

import "./index.css"

import TaskForm from "../TaskForm"

const TaskHeader = (props) => {
  const { handleSearchTitle, handleActiveFilters, activeFilters, fetchTasks } =
    props
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const [loading, setLoading] = React.useState(false)
  const popupRef = React.useRef(null)

  const location = window.location.pathname

  const handleTaskData = async (data) => {
    setLoading(true)

    //Api call for creating task
    const taskData = {
      ...data,
      createdBy: JSON.parse(localStorage.getItem("user")).name,
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(taskData),
    }

    const response = await fetch(
      "http://localhost:5000/api/tasks/create",
      options
    )
    const json = await response.json()
    console.log(json)
    if (response.ok) {
      setLoading(false)
      toast.success("Task Created")
      popupRef.current.close()
      fetchTasks.current()
    } else {
      setLoading(false)
      toast.error(json.message)
    }
  }

  return (
    <div className="task-container-header">
      <div>
        <div className="task-search-container">
          <input
            type="search"
            placeholder="Title"
            onChange={(e) => {
              handleSearchTitle(e.target.value)
            }}
          />
          <FiSearch className="header-icon" />
        </div>
        <div className="task-filter-container">
          <Popup
            trigger={
              <button className="filter-btn">
                <FiFilter className="header-icon" />
              </button>
            }
            position="bottom center"
          >
            <div className="filter-popup-container">
              <h4>Status</h4>
              <div className="filter-status-container">
                <div className="filter-status">
                  <input
                    type="checkbox"
                    id="pending"
                    value="Pending"
                    checked={activeFilters.includes("Pending")}
                    onChange={(e) => {
                      handleActiveFilters(e.target.value, e.target.checked)
                    }}
                  />
                  <label htmlFor="pending">Pending</label>
                </div>
                <div className="filter-status">
                  <input
                    type="checkbox"
                    id="inProgress"
                    value="In Progress"
                    checked={activeFilters.includes("In Progress")}
                    onChange={(e) => {
                      handleActiveFilters(e.target.value, e.target.checked)
                    }}
                  />
                  <label htmlFor="inProgress">In Progress</label>
                </div>
                <div className="filter-status">
                  <input
                    type="checkbox"
                    id="completed"
                    value="Completed"
                    checked={activeFilters.includes("Completed")}
                    onChange={(e) => {
                      handleActiveFilters(e.target.value, e.target.checked)
                    }}
                  />
                  <label htmlFor="completed">Completed</label>
                </div>
              </div>
            </div>
          </Popup>
        </div>
        {location !== "/assigned-to-me" && location !== "/all-tasks" && (
          <div className="create-task-container">
            <Popup
              trigger={
                <button className="create-task-btn">
                  <FiPlus className="header-icon" />
                </button>
              }
              modal
              nested
              ref={popupRef}
            >
              <TaskForm
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                reset={reset}
                handleTaskData={handleTaskData}
                type="create"
                loading={loading}
              />
            </Popup>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskHeader
