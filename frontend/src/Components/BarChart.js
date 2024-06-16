import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by fiscal quarter
    const groupedData = d3.groups(data, (d) => d.closed_fiscal_quarter);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(groupedData.map((d) => d[0]))
      .range([0, width])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(groupedData, (d) => d3.sum(d[1], (g) => g.acv))])
      .range([height, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(["Existing Customer", "New Customer"])
      .range(["#4682B4", "#FFA500"]);

    // Create stack generator with the correct order
    const stack = d3
      .stack()
      .keys(["Existing Customer", "New Customer"])
      .value((d, key) => d[1].find((g) => g.Cust_Type === key)?.acv || 0);

    // Stack data
    const stackedData = stack(groupedData);

    // Add grid lines with lighter color
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#e0e0e0"); // Set grid line color to a lighter shade

    // Draw bars
    svg
      .selectAll(".layer")
      .data(stackedData)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (d) => colorScale(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => xScale(d.data[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth());

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    svg.append("g").call(d3.axisLeft(yScale).tickFormat(d3.format("$.2s")));

    // Add labels for each segment
    svg
      .selectAll(".label")
      .data(groupedData)
      .join("g")
      .attr("class", "label")
      .attr(
        "transform",
        (d) => `translate(${xScale(d[0]) + xScale.bandwidth() / 2},0)`
      )
      .selectAll("text")
      .data((d) => {
        const total = d3.sum(d[1], (g) => g.acv);
        return d[1].map((g) => ({
          ...g,
          percentage: ((g.acv / total) * 100).toFixed(0),
          total: total,
          yPosition: yScale(total - g.acv),
        }));
      })
      .join("text")
      .attr("y", (d) => d.yPosition - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-family", "arial")
      .text((d) => `$${(d.acv / 1000).toFixed(0)}K (${d.percentage}%)`);

    // Add total labels at the top of each bar
    svg
      .selectAll(".total-label")
      .data(groupedData)
      .join("text")
      .attr("class", "total-label")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d3.sum(d[1], (g) => g.acv)) - 10)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .style("font-family", "arial")
      .text((d) => `$${(d3.sum(d[1], (g) => g.acv) / 1000).toFixed(0)}K`);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
