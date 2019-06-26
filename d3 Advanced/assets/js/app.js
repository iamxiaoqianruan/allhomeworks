

// step 1:prepare data
// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv")
  .then(function(data) {
    // console.log(data);
  // Format the data
  // circle text
  var abbr = data.map(data => data.abbr);
  // console.log("abbr"+abbr);
  // x-axis
  var poverty = data.map(data=> Number(data.poverty)+ '%');
  // console.log("poverty"+poverty);
  var age = data.map(data=> Number(data.age));
  // console.log("age"+age);
  var income = data.map(data=> Number(data.income));
  // console.log("income"+income);
  // y-axis
  var obese = data.map(data=> Number(data.obesity)+ '%');
  // console.log("obese"+obese);
  var smoke = data.map(data=> Number(data.smokes)+ '%');
  // console.log("smoke"+smoke);
  var lackCare = data.map(data=> Number(data.healthcareLow)+ '%');
  // console.log("lackCare"+lackCare);

});



var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(data) {
    console.log(data);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
  var xtext = "In Poverty"
  var ytext = "Obese (%)"
  var abbr = data.map(data => data.abbr);
  var state = data.map(data => data.state);
  // x-axis
  var poverty = data.map(data=> Number(data.poverty)+ '%');
  var age = data.map(data=> Number(data.age));
  var income = data.map(data=> Number(data.income));
  // y-axis
  var obese = data.map(data=> Number(data.obesity)+ '%');
  var smoke = data.map(data=> Number(data.smokes)+ '%');
  var lackCare = data.map(data=> Number(data.healthcareLow)+ '%');

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Number(d.poverty))])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Number(d.obesity))])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}% <br>obesity: ${d.obesity}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text(ytext);

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text(xtext);
  });
