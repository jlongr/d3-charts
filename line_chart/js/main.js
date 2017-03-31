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
          .rangeRound([0, interiorWidth]);

let y = d3.scaleLinear()
    .rangeRound([interiorHeight, 0]);

let z = d3.scaleOrdinal(d3.schemeCategory10);

let line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.category); })
    .y(function(d) { return y(d.measure); });

let data = [
  {category: "A", series: "first", measure: .08167},
  {category: "B", series: "first", measure: .01492},
  {category: "C", series: "first", measure: .02782},
  {category: "D", series: "first", measure: .04253},
  {category: "E", series: "first", measure: .12702},
  {category: "F", series: "first", measure: .02288},
  {category: "G", series: "first", measure: .02015},
  {category: "H", series: "first", measure: .06094},
  {category: "I", series: "first", measure: .06966},
  {category: "J", series: "first", measure: .00153},
  {category: "K", series: "first", measure: .00772},
  {category: "L", series: "first", measure: .04025},
  {category: "M", series: "first", measure: .02406},
  {category: "N", series: "first", measure: .06749},
  {category: "O", series: "first", measure: .07507},
  {category: "P", series: "first", measure: .01929},
  {category: "Q", series: "first", measure: .00095},
  {category: "R", series: "first", measure: .05987},
  {category: "S", series: "first", measure: .06327},
  {category: "T", series: "first", measure: .09056},
  {category: "U", series: "first", measure: .02758},
  {category: "V", series: "first", measure: .00978},
  {category: "W", series: "first", measure: .02360},
  {category: "X", series: "first", measure: .00150},
  {category: "Y", series: "first", measure: .01974},
  {category: "Z", series: "first", measure: .00074},

  {category: "A", series: "second", measure: .8167},
  {category: "B", series: "second", measure: .1492},
  {category: "C", series: "second", measure: .2782},
  {category: "D", series: "second", measure: .4253},
  {category: "E", series: "second", measure: .2702},
  {category: "F", series: "second", measure: .2288},
  {category: "G", series: "second", measure: .2015},
  {category: "H", series: "second", measure: .6094},
  {category: "I", series: "second", measure: .6966},
  {category: "J", series: "second", measure: .0153},
  {category: "K", series: "second", measure: .0772},
  {category: "L", series: "second", measure: .4025},
  {category: "M", series: "second", measure: .2406},
  {category: "N", series: "second", measure: .6749},
  {category: "O", series: "second", measure: .7507},
  {category: "P", series: "second", measure: .1929},
  {category: "Q", series: "second", measure: .0095},
  {category: "R", series: "second", measure: .5987},
  {category: "S", series: "second", measure: .6327},
  {category: "T", series: "second", measure: .9056},
  {category: "U", series: "second", measure: .2758},
  {category: "V", series: "second", measure: .0978},
  {category: "W", series: "second", measure: .2360},
  {category: "X", series: "second", measure: .0150},
  {category: "Y", series: "second", measure: .1974},
  {category: "Z", series: "second", measure: .0074}
];

let keys = data.map(function(d) { return d.series; })
               .filter(function(d,i,a) { return a.indexOf(d) == i; });

let series = keys.map(function(datum) {
    return {
      id: datum,
      values: data.filter(function(d) { return d.series == datum; })
        .map(function(d) { return {category: d.category, measure: d.measure}; })
    };
});

x.domain(
  data.map(function(d) { return d.category; })
  //d3.extent(data, function(d) { return d.category; })
);

y.domain(
  d3.extent(data, function(d) { return d.measure; })
);

z.domain(series.map(function(c) { return c.id; }));

svg.append("g")
    .attr("transform", translate(0, interiorHeight))
    .call(d3.axisBottom(x))
  .select(".domain");
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
      .attr("stroke", function(d) { return z(d.id); });


function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
