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

let divergingScale = d3.scaleLinear()
    .domain([data.minValue(), data.median(), data.maxValue()])
    .range(["red", "yellow", "green"]);

let colorPalette = [];

for(let i=0, groups=data.seriesNames().length; i < groups; i++) {
  colorPalette.push( d3.interpolateWarm(i/groups) );
}

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
          .rangeRound([0, interiorWidth]);

let y = d3.scaleLinear()
          .rangeRound([interiorHeight, 0]);

let z = d3.scaleOrdinal(colorPalette);

let line = d3.line()
    .curve(d3.curveCatmullRom)
    .x(function(d) { return x(d.category); })
    .y(function(d) { return y(d.measure); });


x.domain( data.categoryNames() );

y.domain( data.extent() ).nice();

z.domain( data.seriesNames() );

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
      .attr("stroke", function(d) {
        let avg = d3.mean(d.values, function(value) {
          return value.measure;
        });

        return divergingScale(avg);
        /*return z(d.name);*/
      })
      .attr("transform", translate(x.bandwidth()/2, 0));


let tooltip =
  svg.append("g")
       .attr("class", "tooltip")
       .attr("transform", translate(x.bandwidth()/2, 0))
       .style("visibility", "hidden");

data.seriesNames().forEach(function(name) {
  let seriesName = classy(name);

  tooltip.append("circle")
         .attr("class","tooltip series_" + seriesName)
         .attr("cy", 0)
         .attr("cx", 0)
         .attr("r", 4)
         .style("fill", "none")
         .style("stroke-width", 2);

   tooltip.append("text")
          .attr("class", "tooltip series_text_" + seriesName)
          .style("font-family", "Helvetica")
          .style("font-size", "11px")
          .style("fill", "black");
});

tooltip.append("line")
       .attr("class", "tooltip guideline_x")
       .attr("y1", interiorWidth)
       .attr("y2", interiorWidth)
       .style("stroke", "blue")
       .style("stroke-width", 1)
       .style("stroke-dasharray", "3,3")
       .style("opacity", 0.5);


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

    let avg = d3.mean(
      d.values,
      function(value) { return value.measure; }
    );

    let seriesName = classy(d.name);

    d3.select(".tooltip.series_" + seriesName)
      .attr("stroke", divergingScale(avg))
      .attr("transform", translate(xPos, yPos));

    d3.select(".tooltip.guideline_x")
      .attr("transform", translate(xPos, 0))
      .attr("y1", interiorHeight)
      .attr("y2", 0);

    d3.select(".tooltip.series_text_" + seriesName)
      .attr("transform", translate(xPos, yPos - 5))
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
