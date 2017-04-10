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
  d3.select("#bar")
    .append("svg")
      .attr("width", exteriorWidth)
      .attr("height", exteriorHeight)
    .append("g")
      .attr("transform", translate(margin.left, margin.top));

let x =
  d3.scaleBand()
    .domain( data.categoryNames() )
    .rangeRound( [0, interiorWidth] )
    .paddingInner(0.1);

let x1 =
  d3.scaleBand()
    .domain( data.seriesNames() )
    .rangeRound( [0, x.bandwidth()] )
    .padding(0.05);

let y =
  d3.scaleLinear()
    .domain( data.extent() ).nice()
    .rangeRound( [interiorHeight, 0] );


var color = colors.generateScale({
  scale: "ordinal",
  palette: "interpolateViridis"
});


svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", translate(0, interiorHeight))
   .call(d3.axisBottom(x));

svg.append("g")
     .attr("class", "axis axis--y")
   .call(d3.axisLeft(y).ticks( data.seriesNames().length + 1 ))
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
     .data( data.rows() )
   .enter().append("g")
     .attr("transform", function(d) {
       return translate(x(d.category), 0);
     })
   .selectAll("rect")
     .data(function(d) {
        return [{key: d.series, value: d.measure }];
      })
   .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return x1(d.key); })
     .attr("y", function(d) { return y(d.value); })
     .attr("width", x1.bandwidth())
     .attr("height", function(d) { return interiorHeight - y(d.value); })
     .attr("fill", function(d) { return color(d.key); })
   .append("title")
     .text(function(d) { return d.key +":  "+ d.value; });


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
