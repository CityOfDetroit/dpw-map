// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"assets/js/map.js":[function(require,module,exports) {
var bounds = [[-83.3437, 42.2102], // Southwest coordinates
[-82.8754, 42.5197] // Northeast coordinates
];
mapboxgl.accessToken = 'pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q';
var map = new mapboxgl.Map({
  container: 'map',
  // container id
  style: 'mapbox://styles/slusarskiddetroitmi/ciymfavyb00072sqe0bu9rwht',
  //stylesheet location
  center: [-83.1, 42.36],
  // starting position
  zoom: 10.5 // starting zoom

});
map.on('load', function (window) {
  // use waste districts
  map.addSource('waste', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/DPW/2019Services/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addSource('trash', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/DPW/DPW_Services/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addSource('recycle', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/DPW/DPW_Services/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addSource('bulk', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/DPW/DPW_Services/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=2898&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addSource('main-roads', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/DPW/2017RoadsProgram/MapServer/0/query?where=road_type%3D%27Major%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addSource('residential-roads', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/DPW/2017RoadsProgram/MapServer/0/query?where=road_type%3D%27Residential%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addLayer({
    "id": "advance-fill",
    "type": "fill",
    "source": "waste",
    'minzoom': 9,
    'maxzoom': 20,
    "layout": {},
    "paint": {
      "fill-color": '#377eb8',
      "fill-opacity": 0
    },
    "filter": ["==", "contractor", "advance"]
  });
  map.addLayer({
    "id": "gfl-fill",
    "type": "fill",
    "paint": {
      "fill-color": '#377eb8',
      "fill-opacity": 0
    },
    "source": "waste",
    'minzoom': 9,
    'maxzoom': 20,
    "layout": {},
    "filter": ["==", "contractor", "gfl"]
  }); //========== trash days ==================

  map.addLayer({
    "id": "trash-monday",
    "type": "fill",
    "source": "waste",
    "layout": {},
    "paint": {
      "fill-color": '#377eb8',
      "fill-opacity": 0.6
    },
    "filter": ["==", "day", "monday"]
  });
  map.addLayer({
    "id": "trash-tuesday",
    "type": "fill",
    "source": "waste",
    "layout": {},
    "paint": {
      "fill-color": '#4daf4a',
      "fill-opacity": 0.6
    },
    "filter": ["==", "day", "tuesday"]
  });
  map.addLayer({
    "id": "trash-wednesday",
    "type": "fill",
    "source": "waste",
    "layout": {},
    "paint": {
      "fill-color": '#984ea3',
      "fill-opacity": 0.6
    },
    "filter": ["==", "day", "wednesday"]
  });
  map.addLayer({
    "id": "trash-thursday",
    "type": "fill",
    "source": "waste",
    "layout": {},
    "paint": {
      "fill-color": '#ff7f00',
      "fill-opacity": 0.6
    },
    "filter": ["==", "day", "thursday"]
  });
  map.addLayer({
    "id": "trash-friday",
    "type": "fill",
    "source": "waste",
    "layout": {},
    "paint": {
      "fill-color": '#e41a1c',
      "fill-opacity": 0.6
    },
    "filter": ["==", "day", "friday"]
  });
  map.addLayer({
    "id": "trash-lines",
    "type": "line",
    "source": "waste",
    "layout": {},
    "paint": {
      "line-color": "#FFFFFF",
      "line-width": 1
    }
  });
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox: [-83.3437, 42.2102, -82.8754, 42.5197],
    marker: false,
    placeholder: 'Type your street address.'
  });
  map.addControl(geocoder, 'top-left');
  map.addSource('single-point', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": []
    }
  });
  map.addLayer({
    "id": "point",
    "source": "single-point",
    "type": "circle",
    "paint": {
      "circle-radius": 10,
      "circle-color": "#007cbf"
    }
  });
  geocoder.on('result', function (ev) {
    // console.log(ev.result.geometry);
    var tempAddr = document.querySelector('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input').value.split(',')[0];
    tempAddr = tempAddr.split(' ');
    var newTempAddr = '';
    var size = tempAddr.length;
    tempAddr.forEach(function (item, index) {
      newTempAddr += item;
      index < size && index + 1 !== size ? newTempAddr += '+' : 0;
    }); // console.log(newTempAddr);
    //=================== street sweeping ========================
    // $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/Weeks/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+ev.result.geometry.coordinates[0]+'%2C+'+ev.result.geometry.coordinates[1]+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
    //   console.log(data.features[0].attributes.VISIBLE);
    //   console.log();
    //   console.log(moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-7), 'days').format('MMM,DD'));
    //   console.log(moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-3), 'days').format('MMM,DD'));
    //   document.querySelector('.info-container > .district').innerHTML = '<span>Street Sweeping</span> ' + moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-7), 'days').format('MMM DD') + ' - ' + moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-3), 'days').format('MMM DD');
    // });
    //================ pick up services ==========================

    $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/2019Services/MapServer/0/query?where=&text=&objectIds=&time=&geometry=' + ev.result.geometry.coordinates[0] + '%2C+' + ev.result.geometry.coordinates[1] + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson', function (data) {
      // console.log(data);
      // console.log(ev.result.geometry);
      map.getSource('single-point').setData(ev.result.geometry);
      var todaysMonth = moment().month() + 1;
      var todaysYear = moment().year();
      document.querySelector('.info-container > .street-name').innerHTML = document.querySelector('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input').value.split(',')[0];

      if (data.features[0].attributes.contractor == 'advance') {
        document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="https://www.advanceddisposal.com/mi/detroit/detroit-residential-collection" target="_new">' + capitalizeFirstLetter(data.features[0].attributes.contractor) + '</a> - <a href="tel:844-233-8764">(844) 233-8764</a>';
      } else {
        document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="http://gflusa.com/residential/detroit/" target="_new">' + capitalizeFirstLetter(data.features[0].attributes.contractor) + '</a> - <a href="tel:844-464-3587">(844) 464-3587</a>';
      }

      $.ajax({
        // TODO change this to https
        url: 'https://apis.detroitmi.gov/waste_schedule/details/' + data.features[0].attributes.FID + '/year/' + todaysYear + '/month/' + todaysMonth + '/',
        type: 'GET',
        dataType: 'json',
        success: function success(response) {
          // console.log(response);
          document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.trash.next_pickup).format('MMM Do');
          document.querySelector('.info-container > .recycle').innerHTML = '<span>Curbside Recycle:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.recycling.next_pickup).format('MMM Do');
          document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.bulk.next_pickup).format('MMM Do');

          if (response.next_pickups['yard waste'] != undefined) {
            document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups['yard waste'].next_pickup).format('MMM Do');
          } else {
            document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> Suspended';
          }
        }
      });
      document.querySelector('.info-container > input[name="route-id"]').value = data.features[0].attributes.FID;
      document.querySelector('.service-check > #garbage-checkbox').value = data.features[0].attributes.FID;
      document.querySelector('.service-check > #recycle-checkbox').value = data.features[0].attributes.FID;
      document.querySelector('.service-check > #bulk-yard-checkbox').value = data.features[0].attributes.FID;
      document.querySelector('.info-container > input[name="lng"]').value = ev.result.geometry.coordinates[0];
      document.querySelector('.info-container > input[name="lat"]').value = ev.result.geometry.coordinates[1];
      document.querySelector('#info').className === 'active' ? 0 : document.querySelector('#info').className = 'active';
    });
  });
  document.getElementById('trash-layer-button').checked = true;
});

var closeInfo = function closeInfo() {
  document.querySelector('#info').className === 'active' ? document.querySelector('#info').className = '' : document.querySelector('#info').className = 'active';
  map.flyTo({
    center: [-83.1, 42.36],
    // starting position
    zoom: 10.5,
    // starting zoom
    bearing: 0,
    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 2,
    // make the flying slow
    curve: 1,
    // change the speed at which it zooms out
    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function easing(t) {
      return t;
    }
  });
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var toggleMapLayers = function toggleMapLayers(e) {
  // console.log(e);
  // console.log(e.target.id);
  // console.log(e.target.checked);
  if (e.target.id == 'trash-layer-button') {
    if (e.target.checked === false) {
      e.target.checked = true;
    } else {
      try {
        map.removeLayer('point');
      } catch (e) {
        console.log('No point');
        console.log(e);
      }

      if (document.getElementById('recycle-layer-button').checked) {
        map.removeLayer('recycle-lines');
        map.removeLayer('recycle-monday');
        map.removeLayer('recycle-tuesday');
        map.removeLayer('recycle-wednesday');
        map.removeLayer('recycle-thursday');
        map.removeLayer('recycle-friday');
        document.getElementById('recycle-layer-button').checked = false;
      } else if (document.getElementById('road-layer-button').checked) {
        map.removeLayer('main-roads');
        map.removeLayer('residential-roads');
        document.getElementById('road-layer-button').checked = false;
      } else {
        map.removeLayer('bulk-lines');
        map.removeLayer('bulk-monday');
        map.removeLayer('bulk-tuesday');
        map.removeLayer('bulk-wednesday');
        map.removeLayer('bulk-thursday');
        map.removeLayer('bulk-friday');
        document.getElementById('bulk-layer-button').checked = false;
      }

      document.querySelector('#legend').innerHTML = "<strong>GARBAGE PICK UP DAY</strong><nav class='legend clearfix'><span style='background:#377eb8;'></span><span style='background:#4daf4a;'></span><span style='background:#984ea3;'></span><span style='background:#ff7f00;'></span><span style='background:#e41a1c;'></span><label>Monday</label><label>Tuesday</label><label>Wednesday</label><label>Thursday</label><label>Friday</label></nav>";
      map.addLayer({
        "id": "trash-monday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#377eb8',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "monday"]
      });
      map.addLayer({
        "id": "trash-tuesday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#4daf4a',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "tuesday"]
      });
      map.addLayer({
        "id": "trash-wednesday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#984ea3',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "wednesday"]
      });
      map.addLayer({
        "id": "trash-thursday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#ff7f00',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "thursday"]
      });
      map.addLayer({
        "id": "trash-friday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#e41a1c',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "friday"]
      });
      map.addLayer({
        "id": "trash-lines",
        "type": "line",
        "source": "waste",
        "layout": {},
        "paint": {
          "line-color": "#FFFFFF",
          "line-width": 1
        }
      });
      map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
          "circle-radius": 10,
          "circle-color": "#007cbf"
        }
      });
    }
  } else if (e.target.id == 'recycle-layer-button') {
    if (e.target.checked === false) {
      e.target.checked = true;
    } else {
      try {
        map.removeLayer('point');
      } catch (e) {
        console.log('No point');
        console.log(e);
      }

      if (document.getElementById('trash-layer-button').checked) {
        map.removeLayer('trash-lines');
        map.removeLayer('trash-monday');
        map.removeLayer('trash-tuesday');
        map.removeLayer('trash-wednesday');
        map.removeLayer('trash-thursday');
        map.removeLayer('trash-friday');
        document.getElementById('trash-layer-button').checked = false;
      } else if (document.getElementById('road-layer-button').checked) {
        map.removeLayer('main-roads');
        map.removeLayer('residential-roads');
        document.getElementById('road-layer-button').checked = false;
      } else {
        map.removeLayer('bulk-lines');
        map.removeLayer('bulk-monday');
        map.removeLayer('bulk-tuesday');
        map.removeLayer('bulk-wednesday');
        map.removeLayer('bulk-thursday');
        map.removeLayer('bulk-friday');
        document.getElementById('bulk-layer-button').checked = false;
      }

      document.querySelector('#legend').innerHTML = "<strong>RECYCLE PICK UP DAY</strong><nav class='legend clearfix'><span style='background:#377eb8;'></span><span style='background:#4daf4a;'></span><span style='background:#984ea3;'></span><span style='background:#ff7f00;'></span><span style='background:#e41a1c;'></span><label>Monday</label><label>Tuesday</label><label>Wednesday</label><label>Thursday</label><label>Friday</label></nav>";
      map.addLayer({
        "id": "recycle-monday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#377eb8',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "monday"]
      });
      map.addLayer({
        "id": "recycle-tuesday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#4daf4a',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "tuesday"]
      });
      map.addLayer({
        "id": "recycle-wednesday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#984ea3',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "wednesday"]
      });
      map.addLayer({
        "id": "recycle-thursday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#ff7f00',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "thursday"]
      });
      map.addLayer({
        "id": "recycle-friday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#e41a1c',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "friday"]
      });
      map.addLayer({
        "id": "recycle-lines",
        "type": "line",
        "source": "waste",
        "layout": {},
        "paint": {
          "line-color": "#FFFFFF",
          "line-width": 1
        }
      });
      map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
          "circle-radius": 10,
          "circle-color": "#007cbf"
        }
      });
    }
  } else if (e.target.id == 'bulk-layer-button') {
    if (e.target.checked === false) {
      e.target.checked = true;
    } else {
      try {
        map.removeLayer('point');
      } catch (e) {
        console.log('No point');
        console.log(e);
      }

      if (document.getElementById('trash-layer-button').checked) {
        map.removeLayer('trash-lines');
        map.removeLayer('trash-monday');
        map.removeLayer('trash-tuesday');
        map.removeLayer('trash-wednesday');
        map.removeLayer('trash-thursday');
        map.removeLayer('trash-friday');
        document.getElementById('trash-layer-button').checked = false;
      } else if (document.getElementById('road-layer-button').checked) {
        map.removeLayer('main-roads');
        map.removeLayer('residential-roads');
        document.getElementById('road-layer-button').checked = false;
      } else {
        map.removeLayer('recycle-lines');
        map.removeLayer('recycle-monday');
        map.removeLayer('recycle-tuesday');
        map.removeLayer('recycle-wednesday');
        map.removeLayer('recycle-thursday');
        map.removeLayer('recycle-friday');
        document.getElementById('recycle-layer-button').checked = false;
      }

      document.querySelector('#legend').innerHTML = "<strong>BULK PICK UP DAY</strong><nav class='legend clearfix'><span style='background:#377eb8;'></span><span style='background:#4daf4a;'></span><span style='background:#984ea3;'></span><span style='background:#ff7f00;'></span><span style='background:#e41a1c;'></span><label>Monday</label><label>Tuesday</label><label>Wednesday</label><label>Thursday</label><label>Friday</label></nav>";
      map.addLayer({
        "id": "bulk-monday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#377eb8',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "monday"]
      });
      map.addLayer({
        "id": "bulk-tuesday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#4daf4a',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "tuesday"]
      });
      map.addLayer({
        "id": "bulk-wednesday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#984ea3',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "wednesday"]
      });
      map.addLayer({
        "id": "bulk-thursday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#ff7f00',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "thursday"]
      });
      map.addLayer({
        "id": "bulk-friday",
        "type": "fill",
        "source": "waste",
        "layout": {},
        "paint": {
          "fill-color": '#e41a1c',
          "fill-opacity": 0.6
        },
        "filter": ["==", "day", "friday"]
      });
      map.addLayer({
        "id": "bulk-lines",
        "type": "line",
        "source": "waste",
        "layout": {},
        "paint": {
          "line-color": "#FFFFFF",
          "line-width": 1
        }
      });
      map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
          "circle-radius": 10,
          "circle-color": "#007cbf"
        }
      });
    }
  } else {
    // console.log('detecting road');
    if (e.target.checked === false) {
      e.target.checked = true;
    } else {
      // console.log('activate roads');
      if (document.getElementById('trash-layer-button').checked) {
        map.removeLayer('trash-lines');
        map.removeLayer('trash-monday');
        map.removeLayer('trash-tuesday');
        map.removeLayer('trash-wednesday');
        map.removeLayer('trash-thursday');
        map.removeLayer('trash-friday');
        document.getElementById('trash-layer-button').checked = false;
      } else if (document.getElementById('recycle-layer-button').checked) {
        map.removeLayer('recycle-lines');
        map.removeLayer('recycle-monday');
        map.removeLayer('recycle-tuesday');
        map.removeLayer('recycle-wednesday');
        map.removeLayer('recycle-thursday');
        map.removeLayer('recycle-friday');
        document.getElementById('recycle-layer-button').checked = false;
      } else {
        map.removeLayer('bulk-lines');
        map.removeLayer('bulk-monday');
        map.removeLayer('bulk-tuesday');
        map.removeLayer('bulk-wednesday');
        map.removeLayer('bulk-thursday');
        map.removeLayer('bulk-friday');
        document.getElementById('bulk-layer-button').checked = false;
      }

      document.querySelector('#legend').innerHTML = "<strong>ROAD TYPES</strong><nav class='legend roads clearfix'><span style='background:#377eb8;'></span></span><span style='background:#ff7f00;'></span><label>Residential Roads</label><label>Main Roads</label></nav>";
      map.addLayer({
        'id': 'main-roads',
        'type': 'line',
        'source': 'main-roads',
        'layout': {
          'visibility': 'visible',
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#ff7f00',
          'line-width': 4
        }
      });
      map.addLayer({
        'id': 'residential-roads',
        'type': 'line',
        'source': 'residential-roads',
        'layout': {
          'visibility': 'visible',
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#007cbf',
          'line-width': 4
        }
      });
    }
  }
}; // document.querySelectorAll('.filter-group input[type=checkbox]').forEach(function(item) {
//   item.addEventListener('click',function(e){
//     toggleMapLayers(e);
//   });
// });


var filtersList = document.querySelectorAll('.filter-group input[type=checkbox]');

for (var i = 0; i < filtersList.length; i++) {
  filtersList[i].addEventListener('click', function (e) {
    toggleMapLayers(e);
  });
}

document.getElementById('close-emergency-modal-btn').addEventListener('click', closeInfo);

var phoneFormater = function phoneFormater(obj) {
  var numbers = obj.value.replace(/\D/g, ''),
      char = {
    0: '(',
    3: ')',
    6: '-'
  };
  obj.value = '';

  for (var i = 0; i < numbers.length; i++) {
    obj.value += (char[i] || '') + numbers[i];
  }
};
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35909" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/map.js"], null)
//# sourceMappingURL=/map.b1dc2a2b.js.map