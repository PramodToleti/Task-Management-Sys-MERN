import React from "react"
import * as d3 from "d3"
import { useEffect, useRef } from "react"

import "./index.css"

const PieChart = ({ tasks }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const width = 300
    const height = 300
    const radius = Math.min(width, height) / 2

    const color = d3.scaleOrdinal().range(["#00d97e", "#6278f5", "#afafaf"])

    const arc = d3.arc().innerRadius(0).outerRadius(radius)

    const pie = d3.pie().value((d) => d.value)

    const data = [
      {
        status: "Completed",
        value: tasks.filter((task) => task.status === "Completed").length,
      },
      {
        status: "In Progress",
        value: tasks.filter((task) => task.status === "In Progress").length,
      },
      {
        status: "Pending",
        value: tasks.filter((task) => task.status === "Pending").length,
      },
    ]

    const chartContainer = d3.select(chartRef.current)

    chartContainer.selectAll("svg").remove() // Remove existing SVG elements

    const svg = chartContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.status))
      .attr("stroke", "white")
      .style("stroke-width", "2px")

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => `${d.data.status} (${d.data.value})`)
      .style("fill", "white")
  }, [tasks])

  return (
    <div className="pie-chart-container">
      <div ref={chartRef} className="pie-chart"></div>
      <h3>Total no.of Tasks: {tasks.length}</h3>
    </div>
  )
}

export default PieChart
