var svgWidth = 1000;
var svgHeight = 800;


var margin = {
  top: 20,
  right: 20,
  bottom: 100,
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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) ,
      d3.max(data, d => d[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) ,
      d3.max(data, d => d[chosenYAxis])
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes_X(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// function used for updating yAxis var upon click on axis label
function renderAxes_Y(newYScale, yAxis) {
  var leftAxis = d3.axisBottom(newYScale);

  xAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}



// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis,newYScale,chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("yx", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty (%):";
  }
  else if (chosenXAxis === "age"){
    var xlabel = "Age (Median):";
  }
  else {
    var xlabel = "Household Income:";
  }

 if (chosenYAxis === "obesity") {
    var ylabel = "Obese (%):";
  }
  else if (chosenYAxis === "smokes"){
    var ylabel = "Smokes (%):";
  }
  else {
    var ylabel = "Lacks Healthcare (%):";
  }



  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}



//assets/data/
// Retrieve data from the CSV file and execute everything below
//d3.csv("assets/data/data.csv", function(err, data) {
  d3.csv("assets/data/data.csv").then((data)=> {
  //if (err) throw err;
console.log(data);
  // parse data
  data.forEach(function(data) {
    //data.abbr = string(data.abbr);
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcareLow = +data.healthcareLow;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;

  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale =  yScale(data, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for  3 x- axis labels==============================================how about Y?
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 3}, ${height + 30})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .classed("xaxisText", true) //////////////?2 classed
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .classed("xaxisText", true) //////////////?2 classed
    .text("Age (Median");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .classed("xaxisText", true) //////////////?2 classed
    .text("Household Income");


  // append y axis

  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var obeseLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+10)                    //??????????????????????
    .attr("x", 0 - (height / 2))
    .attr("value", "obese") // value to grab for event listener
    .attr("dy", "1em")
    .classed("yaxisText", true)
    .classed("active", true) //////???? 2 classed
    .text("Obese (%)"); 


  var smokesLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+30)                    //??????????????????????
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .attr("dy", "1em")
    .classed("yaxisText", true)
    .classed("inactive", true) ////////////?? 2 classed
    .text("Smokes (%)"); 


  var healthLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+50)                    //??????????????????????
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcareLow") // value to grab for event listener
    .attr("dy", "1em")
    .classed("yaxisText", true)
    .classed("inactive", true) //////???? 2 classed
    .text("Lacks Healthcare (%)"); 



  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        chosenYAxis = d3.select(".yaxisText").attr("value");

        console.log(chosenXAxis);
        console.log(chosenYAxis);

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        xAxis = renderAxes_X(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);


        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);           
        }

        else if (chosenXAxis === "age"){
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);   
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;
        chosenXAxis = d3.select(".xaxisText").attr("value");

        console.log(chosenXAxis);
        console.log(chosenYAxis);

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        xAxis = renderAxes_X(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);


        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "obese") {
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthLabel
            .classed("active", false)
            .classed("inactive", true);           
        }

        else if (chosenXAxis === "smokes"){
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthLabel
            .classed("active", false)
            .classed("inactive", true);   
        }
        else {
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });




});


