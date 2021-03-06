/**   *** Styles and Formatting ***   **/

//SVG dimensions
let rawWidth = 500, rawHeight = 300;

let margin = {top: 80, right: 60, bottom: 100, left: 60};

//chart content dimensions
let width = rawWidth - margin.left - margin.right,
    height = rawHeight - margin.top - margin.bottom;

//label and border adjustments
let skew = { left: margin.left/2, top:  margin.top/2 };

//percent axis bias
let bias = {
  value: 0.01,
  lower: function() { return +(1 - this.value) },
  upper: function() { return +(1 + this.value) }
};

//auto categorical colors
let color = d3.scale.category10();

//measure formatting
let format = d3.format(",.1f");

//text and graphic styling
let styles = {
  title: {
    fontSize:   "16px",
    fontFamily: "sans-serif",
    fill:       "#000"
  },

  legend: {
    fontSize:   "10px",
    fontFamily: "sans-serif",
    fill:       "#000"
  },

  circle: {
    strokeWidth:      "2px",
    hoverStrokeWidth: "6px",
    inactiveStroke:   "#CCC"
  }
};



/**   *** Data and Statistics ***   **/

//raw data
let dataset = [
  {category: "Am. Indian",  series: "F", 	measure: "28751.50"},
  {category: "Asian",       series: "F", 	measure: "29751.20"},
  {category: "Black",       series: "F", 	measure: "29727.00"},
  {category: "Hispanic",    series: "F", 	measure: "29639.33"},
  {category: "Two or More", series: "F", 	measure: "27500.83"},
  {category: "White",       series: "F", 	measure: "29762.37"},
  {category: "Am. Indian",  series: "M", 	measure: "29000.00"},
  {category: "Asian",       series: "M", 	measure: "28578.50"},
  {category: "Black",       series: "M", 	measure: "29961.28"},
  {category: "Hispanic",    series: "M", 	measure: "29037.47"},
  {category: "Two or More", series: "M", 	measure: "27410.00"},
  {category: "White",       series: "M", 	measure: "29814.44"}
];

dataset.sort(function(x,y) {
  return d3.ascending(x.measure, y.measure)
});
/*
let dataset = [
  {category: "1st Six Weeks", series: "2010-11", measure: "574"},
  {category: "2nd Six Weeks", series: "2010-11", measure: "575"},
  {category: "3rd Six Weeks", series: "2010-11", measure: "569"},
  {category: "4th Six Weeks", series: "2010-11", measure: "579"},
  {category: "5th Six Weeks", series: "2010-11", measure: "569"},
  {category: "6th Six Weeks", series: "2010-11", measure: "556"},

  {category: "1st Six Weeks", series: "2011-12", measure: "535"},
  {category: "2nd Six Weeks", series: "2011-12", measure: "539"},
  {category: "3rd Six Weeks", series: "2011-12", measure: "534"},
  {category: "4th Six Weeks", series: "2011-12", measure: "532"},
  {category: "5th Six Weeks", series: "2011-12", measure: "525"},
  {category: "6th Six Weeks", series: "2011-12", measure: "523"},

  {category: "1st Six Weeks", series: "2012-13", measure: "520"},
  {category: "2nd Six Weeks", series: "2012-13", measure: "520"},
  {category: "3rd Six Weeks", series: "2012-13", measure: "528"},
  {category: "4th Six Weeks", series: "2012-13", measure: "518"},
  {category: "5th Six Weeks", series: "2012-13", measure: "517"},
  {category: "6th Six Weeks", series: "2012-13", measure: "511"},

  {category: "1st Six Weeks", series: "2013-14", measure: "567"},
  {category: "2nd Six Weeks", series: "2013-14", measure: "563"},
  {category: "3rd Six Weeks", series: "2013-14", measure: "558"},
  {category: "4th Six Weeks", series: "2013-14", measure: "564"},
  {category: "5th Six Weeks", series: "2013-14", measure: "562"},
  {category: "6th Six Weeks", series: "2013-14", measure: "551"},

  {category: "1st Six Weeks", series: "2014-15", measure: "569"},
  {category: "2nd Six Weeks", series: "2014-15", measure: "572"},
  {category: "3rd Six Weeks", series: "2014-15", measure: "564"},
  {category: "4th Six Weeks", series: "2014-15", measure: "560"},
  {category: "5th Six Weeks", series: "2014-15", measure: "559"},
  {category: "6th Six Weeks", series: "2014-15", measure: "550"}
];
*/

//data features
let data = {
  max: d3.max(dataset, function(d) { return +d.measure; }),
  min: d3.min(dataset, function(d) { return +d.measure; }),

  categories: uniq(dataset.map(function(d) { return d.category; })),
  series:     uniq(dataset.map(function(d) { return d.series; }))
};



/**   *** Axes Definitions ***   **/

//measure axis
let x = d3.scale.linear()
    .domain([
      data.min * bias.lower(),
      data.max * bias.upper()
    ])
    .range( [0, width] )
    .nice();

let xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(x);


//category axis
let y = d3.scale.ordinal()
    .domain( data.categories )
    .rangePoints( [0, height] );

let yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);



/**   *** Graphic and Text Elements ***   **/

//main SVG instance
let svg = d3.select("#dot-chart").append("svg")
    .attr("width", rawWidth)
    .attr("height", rawHeight)
  .append("g")
    .attr("transform", translate(margin.left, margin.top));

//title
svg.append("text")
    .text("Enrollment")
    .style("fill", styles.title.fill)
    .style("font-size", styles.title.fontSize)
    .style("font-family", styles.title.fontFamily)
    .attr("class", "title")
    .attr("x", width/2 - 20)
    .attr("y", -margin.top*(3/4));

//y-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", translate(skew.left, -skew.top/2))
    .call(yAxis);

//x-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", translate(skew.left, height))
    .call(xAxis);

//border
svg.append("rect")
    .attr("class", "border")
    .attr("x", skew.left)
    .attr("y", -skew.top)
    .attr("width", width)
    .attr("height", height + skew.top);

//guidelines
let guidelines = svg.selectAll(".guidelines")
    .data( data.categories ).enter();

for(let x=0, step=Math.max(width/100, 5); x < width; x+=step) {
  guidelines.append("circle")
    .attr("class", "guidelines")
    .attr("cx", x)
    .attr("cy", function(d, i) { return y(d); })
    .attr("r", 0.5)
    .attr("transform", translate(skew.left, -skew.top/2));
}

//legend positioning
let legendTranslation;

if(data.series.length == 1) {
  legendTranslation = -margin.left*3;
}
else if (data.series.length == 2) {
  legendTranslation = -margin.left*(3/2);
}
else {
  legendTranslation = -margin.left;
}

//legend
svg.selectAll(".legend")
    .data( data.series )
  .enter().append("circle")
    .attr("class", function(d) {
      return "legend series-" + classy(d);
    })
    .attr("cx", function(d,i) {
      return (i+1)*(width/data.series.length);
    })
    .attr("cy", height + (2/3)*margin.bottom)
    .attr("r", 3)
    .attr("stroke", function(d) { return color(d); })
    .attr("stroke-width", styles.circle.strokeWidth)
    .attr("transform", translate(legendTranslation))
  .on("mouseover", legendMouseover)
  .on("mouseout", legendMouseout);

svg.selectAll(".legend-text")
    .data( data.series )
  .enter().append("text")
    .text(function(d) { return d; })
    .style("fill", styles.legend.fill)
    .style("font-size", styles.legend.fontSize)
    .style("font-family", styles.legend.fontFamily)
    .attr("class", function(d) {
      return "legend-text series-" + classy(d);
    })
    .attr("x", function(d,i) {
      return (i+1)*(width/data.series.length) + 6;
    })
    .attr("y", height + (2/3)*margin.bottom + 4)
    .attr("transform", translate(legendTranslation))
  .on("mouseover", legendMouseover)
  .on("mouseout", legendMouseout);

//dots
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle")
    .attr("class", function(d) {
      return "dot" +
             " category-" + classy(d.category) +
             " series-"   + classy(d.series)   ;
    })
    .attr("cx", function(d) { return x(d.measure); })
    .attr("cy", function(d) { return y(d.category); })
    .attr("r", 3)
    .attr("stroke", function(d) { return color(d.series); })
    .attr("stroke-width", styles.circle.strokeWidth)
    .attr("transform", translate(skew.left, -skew.top/2))
    .on("mouseover", chartMouseover)
    .on("mouseout", chartMouseout)
 .append("title").text(
   function(d) { return d.category + " - " + format(d.measure); }
 );


/**   *** Helper Methods ***   **/

function translate(x, y=0) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}

function uniq(arr) {
  let uniqArr = [];

  arr.forEach(function(el) {
    if(uniqArr.indexOf(el) === -1) {
      uniqArr.push(el);
    }
  });

  return uniqArr;
}

//replaces all spaces and periods for class assignment.
function classy(text) {
    return text.replace(/\s|\./g, "-");
}



/**   *** Mouse Events ***   **/

function chartMouseover(d) {
  let cat = classy(d.category),
      ser = classy(d.series);

  d3.selectAll(".dot.category-" +cat+ ".series-" +ser)
    .attr("stroke-width", "6px")
    .moveToFront();
}

function chartMouseout(d) {
  let cat = classy(d.category),
      ser = classy(d.series);

  d3.selectAll(".dot.category-" +cat+ ".series-" +ser)
    .attr("stroke-width", "2px")
    .moveToBack();
}

function legendMouseover(d, i) {
  let selectedSeries = classy(d);

  d3.select(".legend.series-" + selectedSeries)
    .attr("stroke-width", styles.circle.hoverStrokeWidth);

  //redraw pips in case of overlapping values
  d3.selectAll(".dot.series-" + selectedSeries).moveToFront();

  data.series.forEach(function(otherSeries, index){
    if(index != i) {
      d3.selectAll(".dot.series-" + classy(otherSeries))
        .attr("stroke", styles.circle.inactiveStroke);
    }
  });
}

function legendMouseout(d, i) {
  let selectedSeries = classy(d);

  d3.select(".legend.series-" + selectedSeries)
    .attr("stroke-width", styles.circle.strokeWidth);

  d3.selectAll(".dot.series-" + selectedSeries).moveToBack();

  data.series.forEach(function(otherSeries, index){
    if(index != i) {
      d3.selectAll(".dot.series-" + classy(otherSeries))
        .attr("stroke", function(d) { return color(d.series); });
    }
  });
}



/**   *** D3 Prototype Modifications ***   **/

d3.selection.prototype.moveToFront = function() {
  this.each(function() {
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() {
  this.each(function() {
    let firstChild = this.parentNode.firstChild;

    if (firstChild) {
        this.parentNode.insertBefore(this, firstChild);
    }
  });
};
