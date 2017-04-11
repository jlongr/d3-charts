let margin = {
  top:    20,
  right:  20,
  bottom: 30,
  left:   50
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

let parseDate = d3.timeParse("%Y %b %d");


let stack = d3.stack()
      .keys( data.seriesNames() );

let rollup = d3.nest()
      .key(function(d) { return d.category; })
      .entries( data.rows() );

let stackData = stack(
  rollup.map(function(d) {
      let obj = {"category": d.key};

      d.values.forEach(function(d){
        obj[d.series] = d.measure;
      });

      return obj;
    })
);

let stackMaxValue = d3.max(
  rollup.map(function(d) {
      let value = 0;
      d.values.forEach(function(d){
        value += d.measure;
      });
      return value;
    })
);


//let x = d3.scaleTime().range([0, interiorWidth]),
let x = d3.scaleBand()
          .domain( data.categoryNames() )
          .range([0, interiorWidth])
          .paddingInner(1);

let y = d3.scaleLinear()
          .domain([0, stackMaxValue]).nice()
          .range([interiorHeight, 0]);

let color = colors.generateScale({
      scale: "ordinal",
      palette: "interpolateViridis"
    });

let area = d3.area()
    .x( function(d) { return x(d.data.category); })
    .y0(function(d) { return y( d[0] ); })
    .y1(function(d) { return y( d[1] ); });


let layer =
  svg.selectAll(".layer")
     .data( stackData )
     .enter()
     .append("g")
       .attr("class", "layer");

layer.append("path")
    .attr("class", "area")
    .style("fill", function(d) { return color(d.key); })
    .attr("d", area);
    //.append("title").text(function(d) { return d; });
    //tooltip doesn't work

layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
  .append("text")
    .attr("x", interiorWidth - 6)
    .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
    .attr("dy", ".35em")
    .style("font", "15px Helvetica")
    .style("text-anchor", "end")
    .text(function(d) { return d.key; });

svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", translate(0, interiorHeight))
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10));
    //.call(d3.axisLeft(y).ticks(10, "%"));


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
