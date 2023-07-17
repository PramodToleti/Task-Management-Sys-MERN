import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

import "./index.css"

const UsersTable = () => {
  const chartRef = useRef(null)

  const tasks = [
    {
      title: "Task 1",
      dueDate: "2023-07-20",
    },
    {
      title: "Task 2",
      dueDate: "2023-07-25",
    },
    {
      title: "Task 3",
      dueDate: "2023-08-05",
    },
    {
      title: "Task 4",
      dueDate: "2023-08-15",
    },
    {
      title: "Task 5",
      dueDate: "2023-09-10",
    },
  ]

  useEffect(() => {
    if (!tasks) return

    // Format the data
    const parseDate = d3.timeParse("%Y-%m-%d")
    const data = tasks.map((task) => ({
      title: task.title,
      dueDate: parseDate(task.dueDate),
    }))

    // Calculate task count by due date
    const counts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.dueDate.getMonth()
    )

    // Prepare the chart dimensions
    const width = 400
    const height = 200
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Remove any existing SVG elements
    d3.select(chartRef.current).selectAll("svg").remove()

    // Create the SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // Create the scales
    const xScale = d3
      .scaleBand()
      .domain(d3.range(counts.length))
      .range([margin.left, innerWidth + margin.left])
      .paddingInner(0.1)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d[1])])
      .range([innerHeight, margin.top])

    // Create the color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(d3.range(counts.length))
      .range(d3.schemeCategory10)

    // Draw the bars
    svg
      .selectAll("rect")
      .data(counts)
      .join("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d[1]))
      .attr("fill", (d, i) => colorScale(i))
  }, [tasks])

  return <div ref={chartRef} className="data-table"></div>
}

export default UsersTable
