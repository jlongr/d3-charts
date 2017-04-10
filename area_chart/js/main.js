let margin = {
  top:    20,
  right:  20,
  bottom: 30,
  left:   40
};

let exteriorWidth  = 550,
    exteriorHeight = 250;

let interiorWidth  = exteriorWidth - margin.left - margin.right,
    interiorHeight = exteriorHeight - margin.top - margin.bottom;

let colorPalette = [
  "#98abc5", "#8a89a6",
  "#7b6888", "#6b486b",
  "#a05d56", "#d0743c",
  "#ff8c00",
];

let svg =
  d3.select("#area")
    .append("svg")
      .attr("width", exteriorWidth)
      .attr("height", exteriorHeight)
    .append("g")
      .attr("transform", translate(margin.left, margin.top));

var parseTime = d3.timeParse("%d-%b-%y");

var x =
  //d3.scaleTime()
  d3.scaleBand()
    .domain( data.categoryNames() )
    .rangeRound([0, interiorWidth]);

var y =
  d3.scaleLinear()
    .domain( data.extent() ).nice()
    .rangeRound([interiorHeight, 0]);

let color = colors.generateScale({
  scale: "ordinal",
  palette: "interpolateViridis"
});

var area =
  d3.area()
    .curve(d3.curveCatmullRom)
    .x(function(d) { return x(d.category); })
    .y1(function(d) { return y(d.measure); })
    .y0( y(0) );

let keys = data.seriesNames();

let series = data.series();


let path =
  svg.selectAll(".areas")
       .data(series)
     .enter()
     .append("g")
       .attr("class", "areas");

path.append("path")
     .style("opacity", function(d, i) {
       let len = data.seriesNames().length;

       return (len - i)/len;
     })
     .attr("fill", function(d) { return color(d.name); })
     .attr("d", function(d) { return area(d.values); })
     .attr("transform", translate(x.bandwidth()/2, 0));

svg.append("g")
    .attr("transform", translate(0, interiorHeight))
    .call(d3.axisBottom(x));

svg.append("g")
    .call(d3.axisLeft(y).ticks(data.seriesNames().length + 1))
  .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
  .text("Axis Title");


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
