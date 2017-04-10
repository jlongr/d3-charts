const colors = (function() {
  let _colorPalette = "interpolateCool";
  let _domain;
  let _range;

  //getters/setters
  let _setPalette = function(palette) {
      _colorPalette = palette || _colorPalette;
  };

  let _setDomain = function(arr) {
      _domain = arr;
  };

  let _setRange = function(arr) {
      _range = arr;
  };


  let _getPalette = function() {
      return _colorPalette;
  };

  let _getDomain = function() {
    return _domain;
  };

  let _getRange = function() {
    return _range;
  };


  //scale options
  let sequentialOptions = {
    viridis: 'interpolateViridis',
  	inferno: 'interpolateInferno',
  	magma:   'interpolateMagma',
  	plasma:  'interpolatePlasma',
  	warm:    'interpolateWarm',
  	cool:    'interpolateCool',
  	rainbow: 'interpolateRainbow',
  };

  let divergingOptions = {
    //requires d3.scale.chromatic dependency
  };


  //color scales
  let divergingScale = function() {
    let defaultDomain = [
      data.minValue(),
      data.median(),
      data.maxValue()
    ];

    let defaultRange = [
      "red",
      "yellow",
      "green"
    ];

    return d3.scaleLinear()
      .domain( _getDomain || defaultDomain )
      .range(_getRange() || defaultRange );
  };

  let sequentialScale = function() {
    let defaultDomain = data.extent();

    return d3.scaleSequential()
      .domain( _getDomain() || defaultDomain )
      .interpolator( d3[_getPalette()] );
  };

  let ordinalScale = function() {
    let defaultDomain = data.seriesNames();

    let defaultRange = data.seriesNames()
    .map(function(d,i,a) {
      return d3[_getPalette()](i/a.length);
    });

    return d3.scaleOrdinal()
      .domain( _getDomain() || defaultDomain )
      .range( _getRange() || defaultRange );
  };


  //scale generation interface
  let generateScale = function(props) {
      let scaleType = "default";

      if(props) {
        _setPalette(props.palette);
        _setDomain(props.domain);
        _setRange(props.range);

        scaleType = props.scale;
      }

      switch(scaleType) {
        case "diverging":
          return divergingScale();
        case "sequential":
          return sequentialScale();
        default:
          return ordinalScale();
      }
  };

  return {
    generateScale: generateScale
  };
})();
