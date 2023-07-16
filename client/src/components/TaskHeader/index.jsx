import React, { useEffect } from "react"
import { FiSearch, FiFilter, FiPlus } from "react-icons/fi"
import Popup from "reactjs-popup"
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { Oval } from "react-loader-spinner"
import { toast } from "react-hot-toast"

import "./index.css"

const CreateTaskForm = (props) => {
  const { register, handleSubmit, errors, reset, handleTaskData, loading } =
    props
  const [users, setUsers] = React.useState([])

  const onSubmit = (data) => {
    handleTaskData(data)
    reset()
  }

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }

    const getUsers = async () => {
      const response = await fetch("http://localhost:5000/api/users", options)
      const json = await response.json()
      console.log(json)
      if (response.ok) {
        setUsers(json.data)
      }
    }

    getUsers()
  }, [])

  return (
    <div className="create-task-popup-container">
      <h4>Create Task</h4>
      <div className="create-task-form-container">
        <form className="create-task-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-task-form-input">
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              {...register("title", { required: true })}
              className="task-input-field"
            />
            {errors.title && (
              <span className="task-error-msg">*Title is required</span>
            )}
          </div>
          <div className="create-task-form-input">
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              {...register("description", { required: true })}
              className="task-input-field"
              style={{ resize: "none", minHeight: "200px" }}
            />
            {errors.description && (
              <span className="task-error-msg">*Description is required</span>
            )}
          </div>
          <div className="create-task-form-input">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              {...register("dueDate", { required: true })}
              className="task-input-field"
            />
            {errors.dueDate && (
              <span className="task-error-msg">*Due Date is required</span>
            )}
          </div>
          <div className="create-task-form-input">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              {...register("assignedTo", { required: true })}
              className="task-input-field"
            >
              <option value="Me">Me</option>
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
              <option value="User 3">User 3</option>
            </select>
            {errors.assignedTo && (
              <span className="task-error-msg">*This field is required</span>
            )}
          </div>
          <button type="submit" className="create-btn">
            {loading ? (
              <Oval
                height={25}
                width={25}
                color="#ccc"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#fff"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              "Create"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

const TaskHeader = (props) => {
  const { handleSearchTitle, handleActiveFilters, activeFilters } = props
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
        {location !== "/assigned-to-me" && (
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
              <CreateTaskForm
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
