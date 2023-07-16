const router = require("express").Router()
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")
const Task = require("../models/task")

router.route("/").get(async (req, res) => {
  res.send("Hello from tasks")
})

router.route("/create").post(async (req, res) => {
  const { title, description, dueDate, assignedTo, createdBy, status } =
    req.body

  console.log(req.body)

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      assignedUser: assignedTo,
      createdBy,
      status,
    })

    newTask.save()

    res
      .status(201)
      .json({ message: "Task Created Successfully", task: newTask })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/get/:id").get(async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    const user = await User.findById(id)
    const tasks = await Task.find({ createdBy: user.username })
    const reversedTasks = tasks.reverse()
    res
      .status(200)
      .json({ message: "Tasks Fetched Successfully", tasks: reversedTasks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/update/:id").put(async (req, res) => {
  const { id, title, description, dueDate, assignedTo, createdBy, status } =
    req.body

  try {
    /* const isTaskpresent = await Task.findById(id)
    if (isTaskpresent) {
      isTaskpresent.title = title
      isTaskpresent.description = description
      isTaskpresent.dueDate = dueDate
      isTaskpresent.assignedUser = assignedTo
      isTaskpresent.createdBy = createdBy

      isTaskpresent.save()

      res
        .status(201)
        .json({ message: "Task Updated Successfully", task: isTaskpresent })
    } else {
      res.status(404).json({ message: "Task Not Found" })
    } */

    const updatedTask = await Task.findByIdAndUpdate(id, {
      title,
      description,
      dueDate,
      assignedUser: assignedTo,
      createdBy,
      status,
    })

    res
      .status(201)
      .json({ message: "Task Updated Successfully", task: updatedTask })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/delete/:id").delete(async (req, res) => {
  const { id } = req.params

  try {
    const deletedTask = await Task.findByIdAndDelete(id)

    res
      .status(201)
      .json({ message: "Task Deleted Successfully", task: deletedTask })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/all").get(async (req, res) => {
  try {
    const tasks = await Task.find()
    const reversedTasks = tasks.reverse()
    res
      .status(200)
      .json({ message: "Tasks Fetched Successfully", tasks: reversedTasks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.route("/assigned/:id").get(async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    const tasks = await Task.find({ assignedUser: user.username })
    const reversedTasks = tasks.reverse()
    res
      .status(200)
      .json({ message: "Tasks Fetched Successfully", tasks: reversedTasks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

module.exports = router
