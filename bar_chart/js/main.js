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
  d3.select("#bar")
    .append("svg")
      .attr("width", exteriorWidth)
      .attr("height", exteriorHeight)
    .append("g")
      .attr("transform", translate(margin.left, margin.top));

let x =
  d3.scaleBand()
    .rangeRound([0, interiorWidth])
    .padding(0.1);

let y =
  d3.scaleLinear()
    .rangeRound([interiorHeight, 0]);

let data = [
  {category: "A", value: .08167},
  {category: "B", value: .01492},
  {category: "C", value: .02782},
  {category: "D", value: .04253},
  {category: "E", value: .12702},
  {category: "F", value: .02288},
  {category: "G", value: .02015},
  {category: "H", value: .06094},
  {category: "I", value: .06966},
  {category: "J", value: .00153},
  {category: "K", value: .00772},
  {category: "L", value: .04025},
  {category: "M", value: .02406},
  {category: "N", value: .06749},
  {category: "O", value: .07507},
  {category: "P", value: .01929},
  {category: "Q", value: .00095},
  {category: "R", value: .05987},
  {category: "S", value: .06327},
  {category: "T", value: .09056},
  {category: "U", value: .02758},
  {category: "V", value: .00978},
  {category: "W", value: .02360},
  {category: "X", value: .00150},
  {category: "Y", value: .01974},
  {category: "Z", value: .00074}
];

x.domain(
  data.map(function(d) { return d.category; })
);

y.domain(
  [0, d3.max(data, function(d) { return d.value; })]
);

svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", translate(0, interiorHeight))
   .call(d3.axisBottom(x));

svg.append("g")
     .attr("class", "axis axis--y")
   .call(d3.axisLeft(y).ticks(10, "%"))
   .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("text-anchor", "end")
   .text("Axis Title")
     .style("fill", "black")
     .style("font-size", 10)
     .style("font-family", "sans-serif");

svg.selectAll(".bar")
     .data(data)
   .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return x(d.category); })
     .attr("y", function(d) { return y(d.value); })
     .attr("width", x.bandwidth())
     .attr("height", function(d) { return interiorHeight - y(d.value); })
   .append("title")
     .text(function(d) { return d.category +":  "+ d.value; });


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
