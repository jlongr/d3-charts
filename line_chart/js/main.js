let data = [
  {category: "A", series: "first", measure: 156.33},
  {category: "B", series: "first", measure: 181.97},
  {category: "C", series: "first", measure: 175.09},
  {category: "D", series: "first", measure: 226.65},
  {category: "E", series: "first", measure: 245.68},
  {category: "F", series: "first", measure: 231.17},
  {category: "G", series: "first", measure: 183.75},
  {category: "H", series: "first", measure: 222.58},
  {category: "I", series: "first", measure: 187.69},
  {category: "J", series: "first", measure: 198.13},
  {category: "K", series: "first", measure: 175.96},
  {category: "L", series: "first", measure: 241.99},
  {category: "M", series: "first", measure: 233.83},
  {category: "N", series: "first", measure: 235.77},
  {category: "O", series: "first", measure: 224.75},
  {category: "P", series: "first", measure: 216.46},
  {category: "Q", series: "first", measure: 217.91},
  {category: "R", series: "first", measure: 200.98},
  {category: "S", series: "first", measure: 151.52},
  {category: "T", series: "first", measure: 173.33},
  {category: "U", series: "first", measure: 158.03},
  {category: "V", series: "first", measure: 224.30},
  {category: "W", series: "first", measure: 227.97},
  {category: "X", series: "first", measure: 178.54},
  {category: "Y", series: "first", measure: 214.00},
  {category: "Z", series: "first", measure: 228.36},

  {category: "A", series: "second", measure: 70.44},
  {category: "B", series: "second", measure: 115.19},
  {category: "C", series: "second", measure: 129.26},
  {category: "D", series: "second", measure: 130.46},
  {category: "E", series: "second", measure: 160.35},
  {category: "F", series: "second", measure: 125.37},
  {category: "G", series: "second", measure: 129.44},
  {category: "H", series: "second", measure: 158.30},
  {category: "I", series: "second", measure: 157.00},
  {category: "J", series: "second", measure: 141.88},
  {category: "K", series: "second", measure: 117.02},
  {category: "L", series: "second", measure: 183.72},
  {category: "M", series: "second", measure: 151.56},
  {category: "N", series: "second", measure: 99.06},
  {category: "O", series: "second", measure: 131.15},
  {category: "P", series: "second", measure: 135.07},
  {category: "Q", series: "second", measure: 75.20},
  {category: "R", series: "second", measure: 163.12},
  {category: "S", series: "second", measure: 90.70},
  {category: "T", series: "second", measure: 170.73},
  {category: "U", series: "second", measure: 118.57},
  {category: "V", series: "second", measure: 37.84},
  {category: "W", series: "second", measure: 197.45},
  {category: "X", series: "second", measure: 113.76},
  {category: "Y", series: "second", measure: 161.94},
  {category: "Z", series: "second", measure: 120.04},

  {category: "A", series: "third", measure: 213.29},
  {category: "B", series: "third", measure: 237.60},
  {category: "C", series: "third", measure: 211.31},
  {category: "D", series: "third", measure: 201.19},
  {category: "E", series: "third", measure: 218.14},
  {category: "F", series: "third", measure: 271.18},
  {category: "G", series: "third", measure: 201.47},
  {category: "H", series: "third", measure: 249.91},
  {category: "I", series: "third", measure: 240.71},
  {category: "J", series: "third", measure: 261.57},
  {category: "K", series: "third", measure: 240.35},
  {category: "L", series: "third", measure: 247.50},
  {category: "M", series: "third", measure: 240.66},
  {category: "N", series: "third", measure: 261.89},
  {category: "O", series: "third", measure: 210.31},
  {category: "P", series: "third", measure: 260.54},
  {category: "Q", series: "third", measure: 197.98},
  {category: "R", series: "third", measure: 211.10},
  {category: "S", series: "third", measure: 248.96},
  {category: "T", series: "third", measure: 210.91},
  {category: "U", series: "third", measure: 244.73},
  {category: "V", series: "third", measure: 237.50},
  {category: "W", series: "third", measure: 241.16},
  {category: "X", series: "third", measure: 235.07},
  {category: "Y", series: "third", measure: 252.14},
  {category: "Z", series: "third", measure: 202.54}
];

/*
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

    data.push({
      category: categoryName,
      series: seriesName,
      measure: generateData( (100*i)*random, 100*random, 0.2 )
    });
  });
});
*/

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
