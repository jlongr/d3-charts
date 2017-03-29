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
  d3.select("#stacked-area")
    .append("svg")
      .attr("width", exteriorWidth)
      .attr("height", exteriorHeight)
    .append("g")
      .attr("transform", translate(margin.left, margin.top));

var parseDate = d3.timeParse("%Y %b %d");

//var x = d3.scaleTime().range([0, interiorWidth]),
var x = d3.scaleBand().range([0, interiorWidth]);
    y = d3.scaleLinear().range([interiorHeight, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var stack = d3.stack();

var area = d3.area()
    .x(function(d, i) { return x(d.data.category); })
    .y0(function(d) { return y( d[0] ); })
    .y1(function(d) { return y( d[1] ); });

let data = {
  raw: [
    {category: "A", series: "first",   measure: .25},
    {category: "B", series: "first",   measure: .35},
    {category: "C", series: "first",   measure: .45},
    {category: "D", series: "first",   measure: .55},
    {category: "A", series: "second",  measure: .17},
    {category: "B", series: "second",  measure: .27},
    {category: "C", series: "second",  measure: .37},
    {category: "D", series: "second",  measure: .47}
  ],
  munged: []
};

let rollup =
  d3.nest()
    .key(function(d) { return d.category; })
    .entries(data.raw);

data.munged = rollup.map(function(d) {
  let obj = {"category": d.key};

  d.values.forEach(function(d){
    obj[d.series] = d.measure;
  });

  return obj;
});


var keys = data.raw.map(function(d) { return d.series; })
                   .filter(function(d,i,a) { return a.indexOf(d) == i; });


//x.domain(d3.extent(data, function(d) { return d.date; }));
x.domain(
  data.munged.map(function(d) { return d.category; })
);

z.domain(keys);

stack.keys(keys);

var layer =
  svg.selectAll(".layer")
     .data( stack(data.munged) )
     .enter()
     .append("g")
       .attr("class", "layer");

layer.append("path")
    .attr("class", "area")
    .style("fill", function(d) { return z(d.key); })
    .attr("d", area)
    .append("title").text(function(d) { return d; });
    //tooltip doesn't work

layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
  .append("text")
    .attr("x", interiorWidth - 6)
    .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
    .attr("dy", ".35em")
    .style("font", "10px sans-serif")
    .style("text-anchor", "end")
    .text(function(d) { return d.key; });

svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", translate(0, interiorHeight))
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10, "%"));


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
