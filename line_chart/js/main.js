let data = [];

let sourceCategories = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

let sourceSeries = [
  "first", "second", "third", "fourth"
];

sourceSeries.forEach(function(seriesName, i) {
  sourceCategories.forEach(function(categoryName) {
    let random = Math.random() * 2;

    let seed = [200, 100, 25];
    let rate = [100, 175, 70];

    data.push({
      category: categoryName,
      series: seriesName,
      measure: generateData( seed[i%3], rate[i%3], random - 0.25 )
    });
  });
});

let max   = d3.max(data, function(d) { return d.measure; } );
let min   = d3.min(data, function(d) { return d.measure; } );
let sigma = d3.deviation(data, function(d) { return d.measure; } );

let keys = data.map(function(d) { return d.series; })
               .filter(function(d,i,a) { return a.indexOf(d) == i; });

let series = keys.map(function(datum) {
    return {
      id: datum,
      values: data.filter(function(d) { return d.series == datum; })
        .map(function(d) { return {category: d.category, measure: d.measure}; })
    };
});

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
    .domain([min, (min+max)/2, max])
    .range(["red", "yellow", "green"]);

let colorPalette = [];

for(let i=0, groups=keys.length; i < groups; i++) {
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
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.category); })
    .y(function(d) { return y(d.measure); });


x.domain(
  data.map(function(d) { return d.category; })
  //d3.extent(data, function(d) { return d.category; })
);

y.domain([
  d3.min(data, function(d) { return d.measure; }) - sigma/Math.pow(data.length, 0.5),
  d3.max(data, function(d) { return d.measure; }) + sigma/Math.pow(data.length, 0.5)
]).nice();

z.domain(series.map(function(c) { return c.id; }));

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
    .data(series)
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
        /*return z(d.id);*/
      })
      .attr("transform", translate(x.bandwidth()/2, 0));


let tooltip =
  svg.append("g")
       .attr("class", "tooltip")
       .attr("transform", translate(x.bandwidth()/2, 0))
       .style("visibility", "hidden");

series.forEach(function(d) {
  let seriesName = classy(d.id);

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

  let index = data.findIndex(function(d) {
    return d.category == category;
  });

  series.forEach(function(d, i, a) {
    let xPos = x(category);
    let yPos = y(d.values[index].measure);

    let avg = d3.mean(d.values, function(value) { return value.measure; });

    let seriesName = classy(d.id);

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

function generateData(seed, rate, skew) {
  return seed + rate*(Math.random() - skew);
}
