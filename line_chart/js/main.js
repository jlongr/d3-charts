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
  d3.select("#line")
    .append("svg")
      .attr("width", exteriorWidth)
      .attr("height", exteriorHeight)
    .append("g")
      .attr("transform", translate(margin.left, margin.top));

let parseTime = d3.timeParse("%d-%b-%y");

/*let x = d3.scaleTime()
    .rangeRound([0, interiorWidth]);*/
let x = d3.scaleBand()
          .domain( data.categoryNames() )
          .rangeRound( [0, interiorWidth] );

let y = d3.scaleLinear()
          .domain( data.extent() ).nice()
          .rangeRound( [interiorHeight, 0] );

let color = colors.generateScale({
  palette: "interpolateViridis"
});


let line = d3.line()
    .curve(d3.curveCatmullRom)
    .x(function(d) { return x(d.category); })
    .y(function(d) { return y(d.measure); });


svg.append("g")
    .attr("transform", translate(0, interiorHeight))
    .call(d3.axisBottom(x));
    //.select(".domain")
    //.remove();

svg.append("g")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Axis Title");

let path =
  svg.selectAll(".lines")
    .data( data.series() )
    .enter()
    .append("g")
      .attr("class", "lines");

path.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("stroke", function(d) { return color(d.name); })
      .attr("transform", translate(x.bandwidth()/2, 0));


let tooltip =
  svg.append("g")
       .attr("class", "tooltip")
       .attr("transform", translate(x.bandwidth()/2, 0))
       .style("visibility", "hidden");

tooltip.append("line")
      .attr("class", "tooltip guideline_x")
      .attr("y1", interiorWidth)
      .attr("y2", interiorWidth)
      .style("stroke", "blue")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.5);

data.seriesNames().forEach(function(name) {
  let seriesName = classy(name);

  tooltip.append("circle")
         .attr("class","tooltip series_" + seriesName)
         .attr("cy", 0)
         .attr("cx", 0)
         .attr("r", 4)
         .style("fill", "white")
         .style("stroke-width", 2);

   tooltip.append("text")
          .attr("class", "tooltip series_text_" + seriesName)
          .attr("paint-order", "stroke")
          .style("font-family", "Helvetica")
          .style("font-size", "14px")
          .style("fill", "#555")
          .style("stroke", "white")
          .style("stroke-width", 3.5);
});




svg.append("rect")
    .attr("width", interiorWidth)
    .attr("height", interiorHeight)
    .style("fill", "none")
    .style("pointer-events", "all")
  .on("mouseover", function() { tooltip.style("visibility", "visible"); })
  .on("mouseout", function() { tooltip.style("visibility", "hidden"); })
  .on("mousemove", mousemove);


function mousemove() {
  let category = x.invert(
    d3.mouse(this)[0]
  );

  let index = data.rows().findIndex(function(d) {
    return d.category == category;
  });

  data.series().forEach(function(d, i, a) {
    let xPos = x(category);
    let yPos = y(d.values[index].measure);

    let seriesName = classy(d.name);

    d3.select(".tooltip.series_" + seriesName)
      .attr("stroke", color(d.name))
      .attr("transform", translate(xPos, yPos));

    d3.select(".tooltip.guideline_x")
      .attr("transform", translate(xPos, 0))
      .attr("y1", interiorHeight)
      .attr("y2", 0);

    d3.select(".tooltip.series_text_" + seriesName)
      .attr("transform", translate(xPos+6, yPos))
      .text(d.values[index].measure.toFixed(2));
  });

}

// custom invert function
x.invert = (function() {
    let scale =
      d3.scaleQuantize()
        .domain( x.range() )
        .range( x.domain() );

    return function(x) {
        return scale(x);
    };
})();


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}

function classy(text) {
    return text.replace(/\s|\./g, "-");
}
