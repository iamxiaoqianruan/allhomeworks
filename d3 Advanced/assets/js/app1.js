function makeResponsive(xlable,ylable) {

  // if the SVG area isn't empty when the browser loads, remove it
  // and replace it with a resized version of the chart
  var svgArea = d3.select("#scatter").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
console.log(xlable); //=====okay
console.log(ylable); // ===okay

// lable below here can't be changed. 

    if (xlable="poverty") {
      var xtext = "In Poverty (%)";
      console.log(xtext);
    } else if (xlable="age") {
      var xtext = "Age (Median)";
      console.log(xtext);
    } else if (xlable="income"){
      var xtext = "Household Income";
      console.log(xtext);
    }

    if (ylable="obesity") {
      var ytext = "Obese (%)";
      console.log(ytext);
    } else if (ylable="smokes") {
      var ytext = "Smokes (%) ";
      console.log(ytext);
    } else if (ylable="healthcareLow") {
      var ytext= "Lacks Healthcare (%)";
      console.log(ytext);
    }


  // SVG wrapper dimensions are determined by the current width
  // and height of the browser window.
  // var svgWidth = window.innerWidth;
  // var svgHeight = window.innerHeight;
  var svgWidth = 900;
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

      var abbr = data.map(data => data.abbr);
      var state = data.map(data => data.state);

    console.log(xlable + ylable)
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      //.domain([0, d3.max(data, d => Number(d.poverty))])
      .domain([0,d3.max(data, d => Number(d[xlable]))])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      //.domain([0, d3.max(data, d => Number(d.obesity))])
      .domain([0,d3.max(data, d => Number(d[ylable]))])
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
    .attr("cx", d => xLinearScale(d[xlable]))
    .attr("cy", d => yLinearScale(d[ylable]))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");
 
    /* Create the text for each block */
    //===========================PROBLEM????????????
    circlesGroup.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("dx", function(d){return -20})
      .text(function(d){return d.abbr})


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




//end of makeresponse
}

//default x and y label
var xlable = document.getElementById("x-value").value
var ylable = document.getElementById("y-value").value;
// When the browser loads, makeResponsive() is called.
makeResponsive(xlable,ylable);

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);


// when select x and y 
function getX(selection) {
console.log(selection);
var xlable = selection;
var ylable = document.getElementById("y-value").value;
makeResponsive(xlable,ylable);
}

function getY(selection) {
console.log(selection);
var ylable = selection;
var xlable = document.getElementById("x-value").value;
makeResponsive(xlable,ylable);
}
