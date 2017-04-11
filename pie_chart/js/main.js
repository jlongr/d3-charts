let width  = 500,
    height = 300,
    radius = Math.min(width, height) / 2;

let color = colors.generateScale({
    scale: "ordinal",
    palette: "interpolateViridis",
    domain: data.categoryNames(),
    range: data.categoryNames().map(function(d,i,a) {
      return d3.interpolateViridis(i/a.length);
    })
});

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
    .value(function(d) { return d.measure; });

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
     .data( pie(data.rows()) )
     .enter()
    .append("g")
     .attr("class", "arc");

arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { console.log(d); return color(d.data.category); });

arc.append("text")
    .attr("transform", function(d) {
        let x = label.centroid(d)[0],
            y = label.centroid(d)[1];

        return translate( x, y );
      })
    .attr("dy", "0.35em")
    .text(function(d) { return d.data.category; });

function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
