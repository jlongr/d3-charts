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
  d3.select("#scatter")
    .append("svg")
      .attr("width", exteriorWidth)
      .attr("height", exteriorHeight)
    .append("g")
      .attr("transform", translate(margin.left, margin.top));

let x = d3.scaleLinear()
    .range([0, interiorWidth]);

let y = d3.scaleLinear()
    .range([interiorHeight, 0]);

let color = d3.scaleOrdinal(d3.schemeCategory10);

let xAxis = d3.axisBottom(x);

let yAxis = d3.axisLeft(y);

let data = {
  raw: [
    {category: "setosa",     series:"sepal", measureX: 3.5, measureY: 5.1},
    {category: "setosa",     series:"sepal", measureX: 3.0, measureY: 4.9},
    {category: "setosa",     series:"sepal", measureX: 3.2, measureY: 4.7},
    {category: "versicolor", series:"sepal", measureX: 3.2, measureY: 3.2},
    {category: "versicolor", series:"sepal", measureX: 3.2, measureY: 3.2},
    {category: "versicolor", series:"sepal", measureX: 3.1, measureY: 3.1},
    {category: "virginica",  series:"sepal", measureX: 2.7, measureY: 2.7},
    {category: "virginica",  series:"sepal", measureX: 3.0, measureY: 3.0},
    {category: "virginica",  series:"sepal", measureX: 2.9, measureY: 2.9}
  ],
  munged: []
};
/*
let rollup =
  d3.nest()
    //.key(function(d) { return d.category; })
    .key(function(d) { return d.series; })
    .entries(data.raw);

console.log(rollup);

rollup.forEach(function(d) {
  let obj = {};

  d.values.forEach(function(d){
    obj["category"] = d.category;
    obj[d.series]   = d.measure;

    data.munged.push(obj);
  });
});*/
console.log(data.munged);
x.domain(d3.extent(data.raw, function(d) { return d.measureX; })).nice();
y.domain(d3.extent(data.raw, function(d) { return d.measureY; })).nice();

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", translate(0, interiorHeight))
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", interiorWidth)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Sepal Width (cm)");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Sepal Length (cm)")

svg.selectAll(".dot")
    .data(data.raw)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.measureX); })
    .attr("cy", function(d) { return y(d.measureY); })
    .style("fill", function(d) { return color(d.category); });

let legend = svg.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return translate(0, i * 20 ); });

legend.append("rect")
    .attr("x", interiorWidth - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", interiorWidth - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
