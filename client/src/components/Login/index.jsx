import React from "react"
import { motion } from "framer-motion"
import { Link, Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { Oval } from "react-loader-spinner"
import { toast } from "react-hot-toast"

import "./index.css"

import girlWithLap2 from "../../assets/girl-with-lap-2.png"

const Login = () => {
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

    const response = await fetch("http://localhost:5000/api/login", options)
    if (response.ok) {
      setLoading(false)
      const json = await response.json()
      console.log(json)
      Cookies.set("token", json.token)
      localStorage.setItem("user", JSON.stringify(json.user))
      toast.success(`Welcome back ${json.user.name}!`)

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
      <div className="login-image-container">
        <img src={girlWithLap2} alt="login-image" />
      </div>
      <div className="login-form-container">
        <div className="login-header">
          <h1>Task Management System</h1>
          <p>Effortlessly Manage Your Tasks &#x1F60A; </p>
          <div className="header-gradient-container"></div>
        </div>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h1>Login</h1>
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
          <button className="login-button">
            {loading ? (
              <Oval
                height={25}
                width={25}
                color="#f34edd"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#fff"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              "Login"
            )}
          </button>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="sign-up-txt">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  )
}

export default Login
