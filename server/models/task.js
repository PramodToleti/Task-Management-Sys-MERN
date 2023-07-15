const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  dueDate: {
    type: Date,
    require: true,
  },
  status: {
    type: String,
    require: true,
    enum: ["Pending", "In progress", "Completed"],
    default: "Pending",
  },
  assignedUser: {
    type: String,
    require: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
