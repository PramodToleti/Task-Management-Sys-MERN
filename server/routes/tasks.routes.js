const router = require("express").Router()
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Task = require("../models/task")

router.route("/").get(async (req, res) => {
  res.send("Hello from tasks")
})

router.route("/create").post(async (req, res) => {
  const { title, description, dueDate, assignedTo, createdBy } = req.body

  console.log(req.body)

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      assignedUser: assignedTo,
      createdBy,
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

module.exports = router
