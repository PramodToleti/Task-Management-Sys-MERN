import React from "react"
import { motion } from "framer-motion"
import { Link, Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { Oval } from "react-loader-spinner"
import { toast } from "react-hot-toast"

import "./index.css"

import girlWithLap from "../../assets/girl-with-lap.png"

const SignUp = () => {
  const [loading, setLoading] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const token = Cookies.get("token")

  if (token) {
    return <Navigate replace to="/" />
  }

  const onSubmit = async (data) => {
    setLoading(true)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(
      "https://tasks-server-backend.onrender.com/api/signup",
      options
    )
    if (response.ok) {
      setLoading(false)
      const json = await response.json()
      console.log(json)
      Cookies.set("token", json.token)
      localStorage.setItem("user", JSON.stringify(json.user))
      toast.success("Account created successfully")

      setTimeout(() => {
        return <Navigate replace to="/" />
      }, 2000)
    } else {
      setLoading(false)
      const json = await response.json()
      toast.error(json.message)
      console.log(json)
    }
  }

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, x: -35 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
    >
      <div className="login-image-container login-image-container-2">
        <img src={girlWithLap} alt="login-image" />
      </div>
      <div className="login-form-container">
        <div className="login-header login-header-2">
          <h1>Task Management System</h1>
          <p>Empower Your Productivity &#x1F600; </p>
          <div className="header-gradient-container header-gradient-container-2"></div>
        </div>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h1>Sign Up</h1>
          <div className="input-container">
            <input
              type="text"
              name="username"
              {...register("username", { required: true })}
            />
            <label htmlFor="input" className="label">
              Name
            </label>
            <div className="underline"></div>
            {errors.username && <p className="error">*Name is required</p>}
          </div>
          <div className="input-container">
            <input
              type="email"
              name="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            <label htmlFor="input" className="label">
              Email
            </label>
            <div className="underline"></div>
            {errors.email && <p className="error">*Email is required</p>}
          </div>
          <div className="input-container">
            <input
              type="password"
              name="password"
              {...register("password", { required: true, minLength: 5 })}
            />
            <label htmlFor="input" className="label">
              Password
            </label>
            <div className="underline"></div>
            {errors.password && (
              <p className="error">*Password must be atleast 5 characters</p>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="role"> Role </label>

            <select
              name="role"
              id="role"
              {...register("role", { required: true })}
              className="select-container"
            >
              <option value="user" selected>
                User
              </option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="login-button sigin-btn">
            {loading ? (
              <Oval
                height={25}
                width={25}
                color="#5330f0"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#fff"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              "Create Account"
            )}
          </button>
          <p>
            Already have an account?{" "}
            <Link to="/login" className="sign-up-txt">
              Login
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  )
}

export default SignUp
