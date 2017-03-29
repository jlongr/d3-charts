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
    .rangeRound([0, interiorWidth]);

var y =
  d3.scaleLinear()
    .rangeRound([interiorHeight, 0]);

var area =
  d3.area()
    .x(function(d) { return x(d.category); })
    .y1(function(d) { return y(d.measure); });

let data = [
  {category: "A", measure: .08167},
  {category: "B", measure: .01492},
  {category: "C", measure: .02782},
  {category: "D", measure: .04253},
  {category: "E", measure: .12702},
  {category: "F", measure: .02288},
  {category: "G", measure: .02015},
  {category: "H", measure: .06094},
  {category: "I", measure: .06966},
  {category: "J", measure: .00153},
  {category: "K", measure: .00772},
  {category: "L", measure: .04025},
  {category: "M", measure: .02406},
  {category: "N", measure: .06749},
  {category: "O", measure: .07507},
  {category: "P", measure: .01929},
  {category: "Q", measure: .00095},
  {category: "R", measure: .05987},
  {category: "S", measure: .06327},
  {category: "T", measure: .09056},
  {category: "U", measure: .02758},
  {category: "V", measure: .00978},
  {category: "W", measure: .02360},
  {category: "X", measure: .00150},
  {category: "Y", measure: .01974},
  {category: "Z", measure: .00074}
];


x.domain(
  //d3.extent(data, function(d) { return d.category; })
  data.map(function(d) { return d.category; })
);

y.domain(
  [0, d3.max(data, function(d) { return d.measure; })]
);

area.y0( y(0) );

svg.append("path")
   .datum(data)
     .attr("fill", "steelblue")
     .attr("d", area)
   .append("title")
     .text(function(d) { console.log(d); return d.category +": "+ d.measure; });
     //tooltip doesn't work.

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
