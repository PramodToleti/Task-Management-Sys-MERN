import React from "react"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule"

import Navbar from "../Navbar"

const Events = () => {
  const token = Cookies.get("token")

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-main">
        <div>
          <h1>Events</h1>
        </div>
        <ScheduleComponent height="500px" selectedDate={new Date()}>
          <Inject
            services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
          />
        </ScheduleComponent>
      </div>
    </div>
  )
}

export default Events
