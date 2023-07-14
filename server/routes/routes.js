const router = require("express").Router()
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

dotenv.config()

//User Singup
router.route("/signup").post(async (req, res) => {
  const { username, email, password } = req.body

  try {
    const isUserPresent = await User.findOne({ email: email })
    if (isUserPresent) {
      res.status(400).json({ message: "User Already Exists" })
    } else {
      const hashPassword = await bcrypt.hash(password, 10)

      const newUser = new User({
        username,
        email,
        password: hashPassword,
      })

      newUser.save()

      const payload = {
        id: newUser._id,
        name: newUser.username,
        email: newUser.email,
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      })

      res
        .status(201)
        .json({ message: "Account Created Successfully", token, user: payload })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

//User Login
router.route("/login").post(async (req, res) => {
  const { email, password } = req.body

  try {
    const isUserPresent = await User.findOne({ email: email })
    if (isUserPresent) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        isUserPresent.password
      )
      if (isPasswordCorrect) {
        const payload = {
          id: isUserPresent._id,
          name: isUserPresent.username,
          email: isUserPresent.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "3d",
        })

        res
          .status(200)
          .json({ message: "Login Successful", token, user: payload })
      } else {
        res.status(400).json({ message: "Invalid Credentials" })
      }
    } else {
      res.status(400).json({ message: "User Not Found" })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

module.exports = router
