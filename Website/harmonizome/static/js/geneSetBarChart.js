//
console.log(id);
console.log(data);
var margin = {
        top: 10,
        right: 20,
        bottom: 10,
        left: 20
    },
    width = 1000 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
//
var x = d3.scaleBand()
    .range([0, width])
    .paddingInner([0.3])
    .paddingOuter([1]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x).tickPadding(6);

var yAxis = d3.axisLeft(y).tickPadding(6);


var svg = d3.selectAll(".table-responsive tbody tr").select('td'+'#'+id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) { return d.name + '<br > <br >' + d.value; });
  svg.call(tool_tip);

// d3.tsv("harmonizome/static/data.tsv", type, function(error, data) {
//   x.domain(data.map(function(d) { return d.name; }));
//   y.domain(d3.extent(data, function(d) { return d.value; })).nice();

// var data = [
//   {name: "SKNO1", value: 3.15212},
//   {name: "KASUMI1", value: 2.04556},
//   {name: "U87MG", value: 1.43394},
//   {name: "COV362", value: -2.23343},
//   {name: "RMGI", value: -1.81945},
//   {name: "SLR25", value: -1.66315},
// ];

x.domain(data.map(function(d) { return d.name; }));
y.domain(d3.extent(data, function(d) { return d.value; })).nice();

svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
    .attr("y", function(d) { return y(Math.max(0, d.value)); })
    .attr("x", function(d) { return x(d.name); })
    .attr("height", function(d) { return Math.abs(y(d.value) - y(0)); })
    .attr("width", x.bandwidth)
    .on('mouseover', tool_tip.show)
    .on('mouseout', tool_tip.hide);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(xAxis)
    .selectAll("text")
      .attr("transform", "rotate(90)")
      .attr("y", 0)
      .attr("x", 10)
      .attr("dy", ".35em")
      .style("text-anchor", "start");


// svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis);






function type(d) {
  d.value = +d.value;
  return d;
}
