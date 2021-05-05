// set the dimensions and margins of the graph
var margin = {top: 25, right: 30, bottom: 180, left: 50},
width = 700 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// Get the Data
d3.csv("https://gist.githubusercontent.com/SanneKerck/86d886f582fd81020390d29c5dee8b98/raw/20aee083cee171eeaa898b0e58ee2d1252d15859/DeadliestYearRegion.csv", function(data) {  
//d3.csv("DeadliestYearRegion.csv", function(data) {  
    
var reg = d3.map(data, function(d){return(d.Region)}).keys()
//var year = d3.map(data, function(d){return(d.IYear)}).keys()

//Title
svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .attr("font-weight", "bold")
    .style("text-decoration", "underline")  
    .text("Year by region given the number of attacks colored by the number of individuals killed");
   
// Add X axis
var x = d3.scaleBand()
    .domain(reg)
    .range([0, width])
    .padding([1])
svg.append("g")
    //Rotate the labels of X axis
    .attr("class","axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(12))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .style("font-size", "11px");
    
// text label for the x axis
svg.append("text")             
    .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 150) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Region");

// Add Y axis
//var y = d3.scaleLinear()
var y = d3.scaleLinear()
    .domain([1970,2019])
    .range([ height, 0]);
svg.append("g")
    .call(d3.axisLeft(y).ticks(40))
    .style("font-size", "11px");

// text label for the y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "0.75em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Year"); 

// Add a scale for bubble size
var z = d3.scaleLinear()
    .domain([0, 6000])
    .range([0, 100]);

// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "10px")
    .style("padding", "10px")

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
var mouseover = function(d) {
    tooltip
    .transition()
    .duration(200)
    tooltip
    .style("opacity", 1)
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
    //.style("opacity", 1)
}
var mousemove = function(d) {
    tooltip
    .html("In " + d.Iyear + " in " + d.Region + " the number of attacks was " + d.Count + " and the number of killed individuals was " + d.Nkill)
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
}
// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = function(d) {
    tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleLinear().domain([0, 7000]).range(["#ededed", "red"]);

// Add dots
svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.Region); } )
    .attr("cy", function (d) { return y(d.Iyear); } )
    .attr("r", function (d) { return z(d.Count); } )
    //.style("fill", "#17becf")
    .style("fill", function(d) {return color(d.Nkill)})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
});