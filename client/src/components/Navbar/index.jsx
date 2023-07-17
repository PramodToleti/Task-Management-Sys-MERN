import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx"

import "./index.css"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const sidebarRef = React.useRef(null)
  const navigate = useNavigate()
  const location = window.location.pathname
  const userDetails = JSON.parse(localStorage.getItem("user"))
  const { name, role } = userDetails

  const handleLogout = () => {
    Cookies.remove("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const activeLink = (path) => {
    console.log
    if (location === path) {
      return "active-link"
    }
    return ""
  }

  const profileIconName = (name) => {
    let initials = ""
    const nameArray = name.split(" ")
    if (nameArray.length > 1) {
      initials = nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase()
    } else {
      initials = nameArray[0][0]
    }
    return initials
  }

  const isAdmin = role === "admin"

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className="hamburger-container">
        <RxHamburgerMenu
          className="hamburger"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="mobile-side-bar"
            initial={{
              x: "-100vw",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100vw",
            }}
            transition={{
              duration: 0.3,
            }}
            ref={sidebarRef}
          >
            <div>
              <RxCross2 className="cross" onClick={() => setIsOpen(false)} />
            </div>
            <div className="profile-container">
              <div className="profile-icon">{profileIconName(name)}</div>
              <div>
                <h3>{name}</h3>
                <p className="role">{role}</p>
              </div>
            </div>
            <div className="sidebar-sub">
              <ul className="nav-links">
                <Link to="/" className={`link ${activeLink("/")}`}>
                  <li>My Tasks</li>
                </Link>
                {/* <Link
                  to="/all-tasks"
                  className={`link ${activeLink("/all-tasks")}`}
                >
                  <li>All Tasks</li>
                </Link> */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`link ${activeLink("/admin/dashboard")}`}
                  >
                    <li>Dashboard</li>
                  </Link>
                )}
                <Link
                  to="/assigned-to-me"
                  className={`link ${activeLink("/assigned-to-me")}`}
                >
                  <li>Assigned to Me</li>
                </Link>
                <Link to="/events" className={`link ${activeLink("/events")}`}>
                  <li>Events</li>
                </Link>
              </ul>
              <button
                type="button"
                className="logout-btn"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <nav className="desktop-sidebar">
        <div className="profile-container">
          <div className="profile-icon">{profileIconName(name)}</div>
          <div>
            <h3>{name}</h3>
            <p className="role">{role}</p>
          </div>
        </div>
        <div className="sidebar-sub">
          <ul className="nav-links">
            <Link to="/" className={`link ${activeLink("/")}`}>
              <li>My Tasks</li>
            </Link>
            {/* <Link
              to="/all-tasks"
              className={`link ${activeLink("/all-tasks")}`}
            >
              <li>All Tasks</li>
            </Link> */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`link ${activeLink("/admin/dashboard")}`}
              >
                <li>Dashboard</li>
              </Link>
            )}
            <Link
              to="/assigned-to-me"
              className={`link ${activeLink("/assigned-to-me")}`}
            >
              <li>Assigned to Me</li>
            </Link>
            <Link to="/events" className={`link ${activeLink("/events")}`}>
              <li>Events</li>
            </Link>
          </ul>
          <button
            type="button"
            className="logout-btn"
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar
