import React, { useEffect, useRef, useMemo } from "react";
import useSVGCanvas from "./useSVGCanvas.js";
import * as d3 from "d3";

//change the code below to modify the bottom plot view
export default function WhiteHatStats(props) {
  //this is a generic component for plotting a d3 plot
  const d3Container = useRef(null);
  //this automatically constructs an svg canvas the size of the parent container (height and width)
  //tTip automatically attaches a div of the class 'tooltip' if it doesn't already exist
  //this will automatically resize when the window changes so passing svg to a useeffect will re-trigger
  const [svg, height, width, tTip] = useSVGCanvas(d3Container);

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  //const margin = 50;
  const radius = 10;

  //TODO: modify or replace the code below to draw a more truthful or insightful representation of the dataset. This other representation could be a histogram, a stacked bar chart, etc.
  //this loop updates when the props.data changes or the window resizes
  //we can edit it to also use props.brushedState if you want to use linking
  /*
    useEffect(()=>{
        //wait until the data loads
        if(svg === undefined | props.data === undefined){ return }

        //aggregate gun deaths by state
        const data = props.data.states;
        
        //get data for each state
        const plotData = [];
        for(let state of data){
            const dd = drawingDifficulty[state.abreviation];
            let entry = {
                'count': state.count,
                'name': state.state,
                'easeOfDrawing': dd === undefined? 5: dd,
                'genderRatio': state.male_count/state.count,
            }
            plotData.push(entry)
        }

        //get transforms for each value into x and y coordinates
        let xScale = d3.scaleLinear()
            .domain(d3.extent(plotData,d=>d.easeOfDrawing))
            .range([margin+radius,width-margin-radius]);
        let yScale = d3.scaleLinear()
            .domain(d3.extent(plotData,d=>d.count))
            .range([height-margin-radius,margin+radius]);


        //draw a line showing the mean values across the curve
        //this probably isn't actually regression
        const regressionLine = [];
        for(let i = 0; i <= 10; i+= 1){
            let pvals = plotData.filter(d => Math.abs(d.easeOfDrawing - i) <= .5);
            let meanY = 0;
            if(pvals.length > 0){
                for(let entry of pvals){
                    meanY += entry.count/pvals.length
                }
            }
            let point = [xScale(i),yScale(meanY)]
            regressionLine.push(point)
        }
        
        //scale color by gender ratio for no reason
        let colorScale = d3.scaleDiverging()
            .domain([0,.5,1])
            .range(['magenta','white','navy']);

        //draw the circles for each state
        svg.selectAll('.dot').remove();
        svg.selectAll('.dot').data(plotData)
            .enter().append('circle')
            .attr('cy',d=> yScale(d.count))
            .attr('cx',d=>xScale(d.easeOfDrawing))
            .attr('fill',d=> colorScale(d.genderRatio))
            .attr('r',10)
            .on('mouseover',(e,d)=>{
                let string = d.name + '</br>'
                    + 'Gun Deaths: ' + d.count + '</br>'
                    + 'Difficulty Drawing: ' + d.easeOfDrawing;
                props.ToolTip.moveTTipEvent(tTip,e)
                tTip.html(string)
            }).on('mousemove',(e)=>{
                props.ToolTip.moveTTipEvent(tTip,e);
            }).on('mouseout',(e,d)=>{
                props.ToolTip.hideTTip(tTip);
            });
           
        //draw the line
        svg.selectAll('.regressionLine').remove();
        svg.append('path').attr('class','regressionLine')
            .attr('d',d3.line().curve(d3.curveBasis)(regressionLine))
            .attr('stroke-width',5)
            .attr('stroke','black')
            .attr('fill','none');

        //change the title
        const labelSize = margin/2;
        svg.selectAll('text').remove();
        svg.append('text')
            .attr('x',width/2)
            .attr('y',labelSize)
            .attr('text-anchor','middle')
            .attr('font-size',labelSize)
            .attr('font-weight','bold')
            .text('How Hard it Is To Draw Each State Vs Gun Deaths');

        //change the disclaimer here
        svg.append('text')
            .attr('x',width-20)
            .attr('y',height/3)
            .attr('text-anchor','end')
            .attr('font-size',10)
            .text("I'm just asking questions");

        //draw basic axes using the x and y scales
        svg.selectAll('g').remove()
        svg.append('g')
            .attr('transform',`translate(0,${height-margin+1})`)
            .call(d3.axisBottom(xScale))

        svg.append('g')
            .attr('transform',`translate(${margin-2},0)`)
            .call(d3.axisLeft(yScale))
        
    },[props.data,svg]);
    */

  /*
  useEffect(() => {
    if (svg === undefined || props.data === undefined) {
      return;
    }

    const data = props.data.states;

    const plotData = [];
    for (let state of data) {
      const dd = drawingDifficulty[state.abreviation];
      let entry = {
        count: state.count,
        name: state.state,
        abbreviation: state.abreviation, // Added abbreviation
        easeOfDrawing: dd === undefined ? 5 : dd,
        genderRatio: state.male_count / state.count,
      };
      plotData.push(entry);
    }

    let xScale = d3
      .scaleBand() // Modified to use scaleBand
      .domain(plotData.map((d) => d.abbreviation)) // Use state abbreviations
      .range([margin, width - margin])
      .padding(0.1);

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(plotData, (d) => d.count)])
      .nice()
      .range([height - margin, margin]);

    let colorScale = d3
      .scaleDiverging()
      .domain([0, 0.5, 1])
      .range(["magenta", "white", "navy"]);

    svg.selectAll(".bar").remove();
    svg
      .selectAll(".bar")
      .data(plotData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.abbreviation))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - margin - yScale(d.count))
      .attr("fill", (d) => colorScale(d.genderRatio))
      .on("mouseover", (e, d) => {
        let string =
          d.name +
          "</br>" +
          "Gun Deaths: " +
          d.count +
          "</br>" +
          "Difficulty Drawing: " +
          d.easeOfDrawing;
        props.ToolTip.moveTTipEvent(tTip, e);
        tTip.html(string);
      })
      .on("mousemove", (e) => {
        props.ToolTip.moveTTipEvent(tTip, e);
      })
      .on("mouseout", (e, d) => {
        props.ToolTip.hideTTip(tTip);
      });

    // Add X Axis
    svg.selectAll(".x-axis").remove();
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin})`)
      .call(d3.axisBottom(xScale));

    // Add Y Axis
    svg.selectAll(".y-axis").remove();
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(yScale));

    // Add Title
    const labelSize = margin / 2;
    svg.selectAll(".title").remove();
    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", labelSize)
      .attr("text-anchor", "middle")
      .attr("font-size", labelSize)
      .attr("font-weight", "bold")
      .text("Gun Deaths by State");

    // Add Disclaimer
    svg.selectAll(".disclaimer").remove();
    svg
      .append("text")
      .attr("class", "disclaimer")
      .attr("x", width - 20)
      .attr("y", height / 3)
      .attr("text-anchor", "end")
      .attr("font-size", 10)
      .text("I'm just asking questions");
  }, [props.data, svg]);
    */

  /*
  useEffect(() => {
    if (svg === undefined || props.data === undefined) {
      return;
    }

    const data = props.data.states;

    const plotData = [];
    for (let state of data) {
      const dd = drawingDifficulty[state.abreviation];
      let entry = {
        count: state.count,
        name: state.state,
        abbreviation: state.abreviation,
        easeOfDrawing: dd === undefined ? 5 : dd,
        maleCount: state.male_count,
        femaleCount: state.count - state.male_count,
      };
      plotData.push(entry);
    }

    let xScale = d3
      .scaleBand()
      .domain(plotData.map((d) => d.abbreviation))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(plotData, (d) => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    let colorScale = d3
      .scaleOrdinal()
      .domain(["male", "female"])
      .range(["blue", "pink"]);

    svg.selectAll(".bar-group").remove();
    const bars = svg
      .selectAll(".bar-group")
      .data(plotData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(${xScale(d.abbreviation)},0)`);

    bars
      .append("rect")
      .attr("class", "male-bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.maleCount))
      .attr("width", xScale.bandwidth() / 2)
      .attr("height", (d) => yScale(0) - yScale(d.maleCount))
      .attr("fill", colorScale("male"));

    bars
      .append("rect")
      .attr("class", "female-bar")
      .attr("x", xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.femaleCount))
      .attr("width", xScale.bandwidth() / 2)
      .attr("height", (d) => yScale(0) - yScale(d.femaleCount))
      .attr("fill", colorScale("female"));

    svg.selectAll(".x-axis").remove();
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.selectAll(".y-axis").remove();
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    const labelSize = margin.top / 2;
    svg.selectAll(".title").remove();
    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", labelSize)
      .attr("text-anchor", "middle")
      .attr("font-size", labelSize)
      .attr("font-weight", "bold")
      .text("Gun Deaths by State");

    svg.selectAll(".disclaimer").remove();
    svg
      .append("text")
      .attr("class", "disclaimer")
      .attr("x", width - 20)
      .attr("y", height / 3)
      .attr("text-anchor", "end")
      .attr("font-size", 10)
      .text("I'm just asking questions");
  }, [props.data, svg]);

  */

  useEffect(() => {
    if (svg === undefined || props.data === undefined) {
      return;
    }

    const data = props.data.states;

    const plotData = [];
    for (let state of data) {
      const dd = drawingDifficulty[state.abreviation];
      let entry = {
        count: state.count,
        name: state.state,
        abbreviation: state.abreviation,
        easeOfDrawing: dd === undefined ? 5 : dd,
        maleCount: state.male_count,
        femaleCount: state.count - state.male_count,
      };
      plotData.push(entry);
    }

    let xScale = d3
      .scaleBand()
      .domain(plotData.map((d) => d.abbreviation))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(plotData, (d) => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    let colorScale = d3
      .scaleOrdinal()
      .domain(["male", "female"])
      .range(["blue", "pink"]);

    svg.selectAll(".bar-group").remove();
    const bars = svg
      .selectAll(".bar-group")
      .data(plotData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(${xScale(d.abbreviation)},0)`);

    bars
      .append("rect")
      .attr("class", "male-bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.maleCount))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.maleCount))
      .attr("fill", colorScale("male"));

    bars
      .append("rect")
      .attr("class", "female-bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(d.maleCount) - yScale(d.count))
      .attr("fill", colorScale("female"));

    svg.selectAll(".x-axis").remove();
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.selectAll(".y-axis").remove();
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    const labelSize = margin.top / 2;
    svg.selectAll(".title").remove();
    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", labelSize)
      .attr("text-anchor", "middle")
      .attr("font-size", labelSize)
      .attr("font-weight", "bold")
      .text("Gun Deaths by State");

    svg.selectAll(".disclaimer").remove();

    // Mouseover functionality
    bars
      .on("mouseover", (e, d) => {
        let string =
          d.name +
          "</br>" +
          "Male Deaths: " +
          d.maleCount +
          "</br>" +
          "Female Deaths: " +
          d.femaleCount +
          "</br>" +
          "Total Deaths: " +
          d.count;
        props.ToolTip.moveTTipEvent(tTip, e);
        tTip.html(string);
      })
      .on("mousemove", (e) => {
        props.ToolTip.moveTTipEvent(tTip, e);
      })
      .on("mouseout", (e, d) => {
        props.ToolTip.hideTTip(tTip);
      });

    const legendEntries = [
      { label: "Male Deaths", color: "blue", key: "maleCount" },
      { label: "Female Deaths", color: "pink", key: "femaleCount" },
    ];

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${width - margin.right - 75},${margin.top + 20})`
      );

    const legendGroups = legend
      .selectAll(".legend-entry")
      .data(legendEntries)
      .enter()
      .append("g")
      .attr("class", "legend-entry")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legendGroups
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => d.color);

    legendGroups
      .append("text")
      .attr("x", 15)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text((d) => d.label);
  }, [props.data, svg]);

  return (
    <div
      className={"d3-component"}
      style={{ height: "600px", width: "1000px" }}
      ref={d3Container}
    ></div>
  );
}
//END of TODO #1.

const drawingDifficulty = {
  IL: 9,
  AL: 2,
  AK: 1,
  AR: 3,
  CA: 9.51,
  CO: 0,
  DE: 3.1,
  DC: 1.3,
  FL: 8.9,
  GA: 3.9,
  HI: 4.5,
  ID: 4,
  IN: 4.3,
  IA: 4.1,
  KS: 1.6,
  KY: 7,
  LA: 6.5,
  MN: 2.1,
  MO: 5.5,
  ME: 7.44,
  MD: 10,
  MA: 6.8,
  MI: 9.7,
  MN: 5.1,
  MS: 3.8,
  MT: 1.4,
  NE: 1.9,
  NV: 0.5,
  NH: 3.7,
  NJ: 9.1,
  NM: 0.2,
  NY: 8.7,
  NC: 8.5,
  ND: 2.3,
  OH: 5.8,
  OK: 6.05,
  OR: 4.7,
  PA: 4.01,
  RI: 8.4,
  SC: 7.1,
  SD: 0.9,
  TN: 3.333333,
  TX: 8.1,
  UT: 2.8,
  VT: 2.6,
  VA: 8.2,
  WA: 9.2,
  WV: 7.9,
  WY: 0,
};