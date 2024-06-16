import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import formatNumber from "../helper/formatNumber";

const PieChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius / 2;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.Cust_Type))
      .range(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.acv);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.Cust_Type))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .style("font-family", "arial")
      .text(
        (d) =>
          `${d.data.Cust_Type} - ${formatNumber(d.data.acv)} (${Math.round(
            d.data.percent
          )}%)`
      );

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return <div ref={ref}></div>;
};

export default PieChart;
