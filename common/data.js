const data = (function() {
  let _data = (
    typeof(instanceData) === "undefined" ?
    generateDummyData(26,3) : instanceData.series[0]
  );

  //getters/setters
  let _setData = function(arr) {
    _data = arr;
  };

  let _getData = function() {
    return _data;
  };


  //public data interface
  let rows = function() {
    return _getData();
  };

  let series = function() {

    return seriesNames().map(function(seriesName) {
      let seriesValues = _getData()
      .filter(
        function(d) {
          return d.series == seriesName;
      })
      .map(
        function(d) {
          return {
            category: d.category,
            measure: d.measure
          };
      });

      return {
        name: seriesName,
        values: seriesValues
      };
    });
  };


  //data features
  let categoryNames = function() {
      return _getData()
      .map(
        function(d) { return d.category; }
      )
      .filter(
        function(d,i,a) { return a.indexOf(d) == i; }
      );
  };

  let seriesNames = function() {
    return _getData()
    .map(
      function(d) { return d.series; }
    )
    .filter(
      function(d,i,a) { return a.indexOf(d) == i; }
    );
  };


  //summary statistics
  let _default = function(d) { return d.measure; };

  let maxValue = function() {
    return d3.max(_getData(), _default);
  };

  let minValue = function() {
    return d3.min(_getData(), _default);
  };

  let extent = function() {
    return d3.extent(_getData(), _default);
  };

  let average = function() {
    return d3.mean(_getData(), _default);
  };

  let median = function() {
    return d3.median(_getData(), _default);
  };

  let variance = function() {
    return d3.variance(_getData(), _default);
  };

  let deviation = function() {
    return d3.deviation(_getData(), _default);
  };


  return {
    rows: rows,
    series: series,

    categoryNames: categoryNames,
    seriesNames: seriesNames,

    maxValue: maxValue,
    minValue: minValue,
    extent: extent,
    average: average,
    median: median,
    variance: variance,
    deviation: deviation,
  };
})();

function generateDummyData(numCategories=26, numSeries=6) {
  let sourceCategories = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z"
  ].slice(0, numCategories);

  let sourceSeries = [
    "first", "second", "third",
    "fourth", "fifth", "sixth"
  ].slice(0, numSeries);

  let dummyData = [];

  sourceSeries.forEach(function(seriesName, i) {
    sourceCategories.forEach(function(categoryName) {
      let seed = [200, 100, 25];
      let rate = [100, 175, 70];
      let skew = (Math.random()-0.25);

      dummyData.push({
        category: categoryName,
        series: seriesName,
        measure: +(seed[i%3] + rate[i%3]*skew).toFixed(2)
      });
    });
  });

  return dummyData;
}
