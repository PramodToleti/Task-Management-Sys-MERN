import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

import "./index.css"

const BarChart = ({ weekData }) => {
  const svgRef = useRef()

  console.log(weekData)

  const data = weekData || [
    { week: 1, tasks: ["task1", "task2", "task3"] },
    { week: 2, tasks: ["task1", "task2", "task3", "task4"] },
    { week: 3, tasks: ["task1", "task2", "task3", "task4", "task5"] },
  ]

  useEffect(() => {
    // Clear any existing graph
    d3.select(svgRef.current).selectAll("*").remove()

    // Define the dimensions and margins for the graph
    const width = 300
    const height = 280
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom

    // Create the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    // Create the graph group
    const graph = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Extract the week and task count from the data
    const weekData = data.map((item) => ({
      week: item.week,
      count: item.tasks.length,
    }))

    // Define the scales for x and y axes
    const xScale = d3
      .scaleBand()
      .domain(weekData.map((d) => d.week))
      .range([0, graphWidth])
      .padding(0.2)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(weekData, (d) => d.count)])
      .range([graphHeight, 0])

    const xAxisLabels = ["2 Weeks Ago", "Previous Week", "Current Week"]
    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => xAxisLabels[i])
    const yAxis = d3.axisLeft(yScale).ticks(5)

    // Append the axes to the graph
    graph
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(xAxis)

    graph.append("g").attr("class", "y-axis").call(yAxis)

    // Create the bars
    graph
      .selectAll(".bar")
      .data(weekData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.week))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => graphHeight - yScale(d.count))
      .attr("fill", "#af7efd")
  }, [data])

  return (
    <div className="bar-chart-container">
      <svg ref={svgRef}></svg>
      <h3>Weekly wise Tasks</h3>
    </div>
  )
}

export default BarChart
