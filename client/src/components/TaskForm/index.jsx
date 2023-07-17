import React, { useEffect } from "react"
import { Oval } from "react-loader-spinner"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"

import "./index.css"

const TaskForm = (props) => {
  const { handleTaskData, loading, type } = props
  const task = props.task || {}
  const [users, setUsers] = React.useState([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const userName = JSON.parse(localStorage.getItem("user")).name

  const onSubmit = (data) => {
    if (type === "create") {
      handleTaskData(data)
    } else {
      handleTaskData({ ...data, id: task._id })
    }
    /* reset() */
  }

  //fetch all users
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }

    const getUsers = async () => {
      const response = await fetch(
        "https://tasks-server-backend.onrender.com/api/users",
        options
      )
      const json = await response.json()
      if (response.ok) {
        setUsers(json)
      }
    }

    getUsers()

    return () => {
      setUsers([])
    }
  }, [])

  return (
    <div className="create-task-popup-container">
      <h4>{type === "create" ? "Create Task" : "Update Task"}</h4>
      <div className="create-task-form-container">
        <form className="create-task-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-task-form-input">
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={task?.title || ""}
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
              defaultValue={task?.description || ""}
              placeholder="Description"
              {...register("description", { required: true })}
              className="task-input-field"
              style={{ resize: "none", minHeight: "150px" }}
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
              min={new Date().toISOString().split("T")[0]}
              defaultValue={
                (() => {
                  const dateObject = new Date(task?.dueDate)
                  const year = dateObject.getFullYear()
                  const month = String(dateObject.getMonth() + 1).padStart(
                    2,
                    "0"
                  )
                  const day = String(dateObject.getDate()).padStart(2, "0")
                  return `${year}-${month}-${day}`
                })() || ""
              }
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
              {users?.map((user) => (
                <option
                  value={user.username}
                  key={user._id}
                  selected={user.username === task.assignedUser}
                >
                  {user.username === userName
                    ? `${user.username} (me)`
                    : user.username}
                </option>
              ))}
            </select>
            {/* {errors.assignedTo && (
              <span className="task-error-msg">*This field is required</span>
            )} */}
          </div>
          <div className="create-task-form-input">
            <label htmlFor="assignedTo">Status</label>
            <select
              id="status"
              name="status"
              {...register("status")}
              className="task-input-field"
            >
              <option value="Pending" selected={task.status === "Pending"}>
                Pending
              </option>
              <option
                value="In Progress"
                selected={task.status === "In Progress"}
              >
                In Progress
              </option>
              <option value="Completed" selected={task.status === "Completed"}>
                Completed
              </option>
            </select>
            {/* {errors.assignedTo && (
              <span className="task-error-msg">*This field is required</span>
            )} */}
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
            ) : type === "create" ? (
              "Create"
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
