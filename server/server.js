const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const routes = require("./routes/user.routes")
const taskRoutes = require("./routes/tasks.routes")

dotenv.config()

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 8000
const mongo_uri = process.env.MONGO_URI

mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`MongoDB connected`)
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((err) => console.log(err))

app.use("/api", routes)
app.use("/api/tasks", taskRoutes)
