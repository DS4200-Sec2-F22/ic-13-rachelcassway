// setting up constants
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 450;
const MARGINS = {left: 60, right: 60, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// setting up a frame for each column
const FRAME1 = d3.select("#left_chart")
                .append("svg")
                .attr("height", FRAME_HEIGHT)
                .attr("width", FRAME_WIDTH)
                .attr("class", "frame");

const FRAME2 = d3.select("#right_chart")
                .append("svg")
                .attr("height", FRAME_HEIGHT)
                .attr("width", FRAME_WIDTH)
                .attr("class", "frame");

// read in boston city hall data
d3.csv("data/city-hall.csv").then ( function(data) {

    // format variables when reading csv
    data.forEach(function(d) {
        return { DateTime_Measured : d3.timeParse("%Y-%m-%d %H:%M:%S") (d.DateTime_Measured), Total_Demand_KW: d.Total_Demand_KW }
    })

    // make xScale for left graph
    const xScaleLeft = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.DateTime_Measured; }))
        .range([0, FRAME_WIDTH]);
    // make yScale for left graph
    const yScaleLeft = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.Total_Demand_KW; })])
      .range([FRAME_HEIGHT, 0]);

    left = makeScatter(data, FRAME1, xScaleLeft, yScaleLeft, data.DateTime_Measured, data.Total_Demand_KW, 5);

});

// read in boston central library data
d3.csv("data/library.csv").then ( function(data) {

    // format variables when reading csv
    data.forEach(function(d) {
        return { datetime_utc_measured : d3.timeParse("%Y-%m-%d %H:%M:%S") (d.datetime_utc_measured), total_demand_kw: d.total_demand_kw }
    })

    // make xScale for right graph
    const xScaleRight = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.datetime_utc_measured; }))
        .range([0, FRAME_WIDTH]);
    // make yScale for right graph
    const yScaleRight = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.total_demand_kw; })])
      .range([FRAME_HEIGHT, 0]);

    right = makeScatter(data, FRAME2, xScaleRight, yScaleRight, data.datetime_utc_measured, data.total_demand_kw, 5);

});


// function that makes a scatterplot given a dataset, FRAME, xScale, yScale, xVar, yVar, and radius
function makeScatter(data, FRAME, xScale, yScale, xVar, yVar, r = 5) {

    // add x-axis
    FRAME.append("g")
        .attr("transform", "translate(" + MARGINS.left +
			"," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(xScale));

    // add y-axis
    FRAME.append("g")
		.attr("transform", "translate(" + MARGINS.left +
			"," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(yScale));

    // add points to scatter plot
    graph = FRAME.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
			return (xScale(d.xVar) + MARGINS.left);}) // x value --> cx
		.attr("cy", (d) => {
			return (yScale(d.yVar) + MARGINS.top);}) // y value --> cy
		.attr("r", r); // point radius
	return graph
}