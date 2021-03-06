let width  = 500,
    height = 300,
    radius = Math.min(width, height) / 2;

let color = d3.scaleOrdinal([
  "#98abc5", "#8a89a6",
  "#7b6888", "#6b486b",
  "#a05d56", "#d0743c",
  "#ff8c00"
]);

let data = [
  {age: "<5",    population: 2704659},
  {age: "5-13",  population: 4499890},
  {age: "14-17", population: 2159981},
  {age: "18-24", population: 3853788},
  {age: "25-44", population: 14106543},
  {age: "45-64", population: 8819342},
  {age: "≥65",   population: 612463}
];

let svg =
  d3.select("#pie")
    .append("svg")
      .attr("width", 500)
      .attr("height", 300)
    .append("g")
      .attr("transform", translate(width/2 ,height/2));

let pie =
  d3.pie()
    .sort(null)
    .value(function(d) { return d.population; });

let path =
  d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

let label =
  d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

let arc =
  svg.selectAll(".arc")
     .data( pie(data) )
     .enter()
    .append("g")
     .attr("class", "arc");

arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.data.age); });

arc.append("text")
    .attr("transform", function(d) {
        let x = label.centroid(d)[0],
            y = label.centroid(d)[1];

        return translate( x, y );
      })
    .attr("dy", "0.35em")
    .text(function(d) { return d.data.age; });

function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
