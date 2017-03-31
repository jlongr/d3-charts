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
    .rangeRound([0, interiorWidth])
    .paddingInner(1);

var y =
  d3.scaleLinear()
    .rangeRound([interiorHeight, 0]);

let z = d3.scaleOrdinal(d3.schemeCategory10);

var area =
  d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.category); })
    .y1(function(d) { return y(d.measure); });

let data = [
  {category: "A", series: "first",   measure: 25},
  {category: "B", series: "first",   measure: 35},
  {category: "C", series: "first",   measure: 15},
  {category: "D", series: "first",   measure: 25},

  {category: "A", series: "second",  measure: 17},
  {category: "B", series: "second",  measure: 47},
  {category: "C", series: "second",  measure: 37},
  {category: "D", series: "second",  measure: 43}
];

let keys = data.map(function(d) { return d.series; })
               .filter(function(d,i,a) { return a.indexOf(d) == i; });

let series = keys.map(function(datum) {
    return {
      id: datum,
      values: data.filter(function(d) { return d.series == datum; })
        .map(function(d) { return {category: d.category, measure: d.measure}; })
    };
});

x.domain(
  //d3.extent(data, function(d) { return d.category; })
  data.map(function(d) { return d.category; })
);

y.domain(
  [0, d3.max(data, function(d) { return d.measure; })]
);

area.y0( y(0) );

let path =
  svg.selectAll(".areas")
       .data(series)
     .enter()
     .append("g")
       .attr("class", "areas");

path.append("path")
     .style("opacity", 0.85)
     .attr("fill", function(d) { return z(d.id); })
     .attr("d", function(d) { return area(d.values); });

svg.append("g")
    .attr("transform", translate(0, interiorHeight))
    .call(d3.axisBottom(x));

svg.append("g")
    .call(d3.axisLeft(y))
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
