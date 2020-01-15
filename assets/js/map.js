var bounds = [
  [		-83.3437, 	42.2102], // Southwest coordinates
  [		-82.8754, 	42.5197]  // Northeast coordinates
];
mapboxgl.accessToken = 'pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q';
var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/slusarskiddetroitmi/ciymfavyb00072sqe0bu9rwht', //stylesheet location
center: [-83.1, 42.36], // starting position
zoom: 10.5, // starting zoom
});
map.on('load', function(window) {
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
    "fill-opacity": 0,
  },
  "filter": ["==", "contractor", "advance"]
});
map.addLayer({
  "id": "gfl-fill",
  "type": "fill",
  "paint": {
    "fill-color": '#377eb8',
    "fill-opacity": 0,
  },
  "source": "waste",
      'minzoom': 9,
      'maxzoom': 20,
  "layout": {},
  "filter": ["==", "contractor", "gfl"]
});
//========== trash days ==================
map.addLayer({
  "id": "trash-monday",
  "type": "fill",
  "source": "waste",
  "layout": {},
  "paint": {
    "fill-color": '#377eb8',
    "fill-opacity": 0.6,
  },
  "filter": ["==", "day", "monday"],

});
map.addLayer({
  "id": "trash-tuesday",
  "type": "fill",
  "source": "waste",
  "layout": {},
  "paint": {
    "fill-color": '#4daf4a',
    "fill-opacity": 0.6,
  },
  "filter": ["==", "day", "tuesday"],

});
map.addLayer({
  "id": "trash-wednesday",
  "type": "fill",
  "source": "waste",
  "layout": {},
  "paint": {
    "fill-color": '#984ea3',
    "fill-opacity": 0.6,
  },
  "filter": ["==", "day", "wednesday"],

});
map.addLayer({
  "id": "trash-thursday",
  "type": "fill",
  "source": "waste",
  "layout": {},
  "paint": {
    "fill-color": '#ff7f00',
    "fill-opacity": 0.6,
  },
  "filter": ["==", "day", "thursday"],

});
map.addLayer({
  "id": "trash-friday",
  "type": "fill",
  "source": "waste",
  "layout": {},
  "paint": {
    "fill-color": '#e41a1c',
    "fill-opacity": 0.6,
  },
  "filter": ["==", "day", "friday"],

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
  bbox: [
      -83.3437,42.2102,
      -82.8754, 42.5197
    ],
  marker: false,
  placeholder: 'Type your street address.',
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
geocoder.on('result', function(ev) {
    // console.log(ev.result.geometry);
    let tempAddr = document.querySelector('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input').value.split(',')[0];
    tempAddr = tempAddr.split(' ');
    let newTempAddr = '';
    let size = tempAddr.length;
    tempAddr.forEach(function(item, index) {
      newTempAddr += item;
      ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
    });
    // console.log(newTempAddr);
    //=================== street sweeping ========================
    // $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/Weeks/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+ev.result.geometry.coordinates[0]+'%2C+'+ev.result.geometry.coordinates[1]+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
    //   console.log(data.features[0].attributes.VISIBLE);
    //   console.log();
    //   console.log(moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-7), 'days').format('MMM,DD'));
    //   console.log(moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-3), 'days').format('MMM,DD'));
    //   document.querySelector('.info-container > .district').innerHTML = '<span>Street Sweeping</span> ' + moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-7), 'days').format('MMM DD') + ' - ' + moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-3), 'days').format('MMM DD');
    // });
    //================ pick up services ==========================
    $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/2019Services/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+ev.result.geometry.coordinates[0]+'%2C+'+ev.result.geometry.coordinates[1]+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
      // console.log(data);
      // console.log(ev.result.geometry);
      map.getSource('single-point').setData(ev.result.geometry);
      let todaysMonth =  moment().month() + 1;
      let todaysYear = moment().year();
      document.querySelector('.info-container > .street-name').innerHTML = document.querySelector('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input').value.split(',')[0];
      if(data.features[0].attributes.contractor == 'advance'){
        document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="https://www.advanceddisposal.com/mi/detroit/detroit-residential-collection" target="_new">' + capitalizeFirstLetter(data.features[0].attributes.contractor) + '</a> - <a href="tel:844-233-8764">(844) 233-8764</a>';
      }else{
        document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="http://gflusa.com/residential/detroit/" target="_new">' + capitalizeFirstLetter(data.features[0].attributes.contractor) + '</a> - <a href="tel:844-464-3587">(844) 464-3587</a>';
      }
      url = 'https://apis.detroitmi.gov/waste_schedule/details/' + data.features[0].attributes.FID  + '/year/' + todaysYear + '/month/' + todaysMonth + '/';
      console.log("url from map ", url);
      $.ajax({
        // TODO change this to https
        url : url,
        type : 'GET',
        dataType:'json',
        success : function(response) {
          // console.log(response);

          document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.trash.next_pickup).format('MMM Do');
          document.querySelector('.info-container > .recycle').innerHTML = '<span>Curbside Recycle:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.recycling.next_pickup).format('MMM Do');
          document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.bulk.next_pickup).format('MMM Do');
          console.log("dateformat" + moment(response.next_pickups.bulk.next_pickup).format('MMM Do'))
          if(response.next_pickups['yard waste'] != undefined){
            document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups['yard waste'].next_pickup).format('MMM Do');
          }else{
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
      (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
    });
});
document.getElementById('trash-layer-button').checked = true;
});

var closeInfo = function closeInfo() {
(document.querySelector('#info').className === 'active') ? document.querySelector('#info').className = '' : document.querySelector('#info').className = 'active';
map.flyTo({
    center: [-83.1, 42.36], // starting position
    zoom: 10.5, // starting zoom
    bearing: 0,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 2, // make the flying slow
    curve: 1, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function (t) {
        return t;
    }
});
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var toggleMapLayers = function toggleMapLayers(e){
// console.log(e);
// console.log(e.target.id);
// console.log(e.target.checked);
if(e.target.id == 'trash-layer-button'){
  if(e.target.checked === false){
    e.target.checked = true;
  }else{
    try {
      map.removeLayer('point');
    } catch (e) {
      console.log('No point');
      console.log(e);
    }

    if(document.getElementById('recycle-layer-button').checked){
      map.removeLayer('recycle-lines');
      map.removeLayer('recycle-monday');
      map.removeLayer('recycle-tuesday');
      map.removeLayer('recycle-wednesday');
      map.removeLayer('recycle-thursday');
      map.removeLayer('recycle-friday');
      document.getElementById('recycle-layer-button').checked = false;
    }else if(document.getElementById('road-layer-button').checked){
      map.removeLayer('main-roads');
      map.removeLayer('residential-roads');
      document.getElementById('road-layer-button').checked = false;
    }else{
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
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "monday"],

    });
    map.addLayer({
      "id": "trash-tuesday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#4daf4a',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "tuesday"],

    });
    map.addLayer({
      "id": "trash-wednesday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#984ea3',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "wednesday"],

    });
    map.addLayer({
      "id": "trash-thursday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#ff7f00',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "thursday"],

    });
    map.addLayer({
      "id": "trash-friday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#e41a1c',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "friday"],

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
}else if(e.target.id == 'recycle-layer-button'){
  if(e.target.checked === false){
    e.target.checked = true;
  }else{
    try {
      map.removeLayer('point');
    } catch (e) {
      console.log('No point');
      console.log(e);
    }
    if(document.getElementById('trash-layer-button').checked){
      map.removeLayer('trash-lines');
      map.removeLayer('trash-monday');
      map.removeLayer('trash-tuesday');
      map.removeLayer('trash-wednesday');
      map.removeLayer('trash-thursday');
      map.removeLayer('trash-friday');
      document.getElementById('trash-layer-button').checked = false;
    }else if(document.getElementById('road-layer-button').checked){
      map.removeLayer('main-roads');
      map.removeLayer('residential-roads');
      document.getElementById('road-layer-button').checked = false;
    }else{
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
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "monday"],

    });
    map.addLayer({
      "id": "recycle-tuesday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#4daf4a',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "tuesday"],

    });
    map.addLayer({
      "id": "recycle-wednesday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#984ea3',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "wednesday"],

    });
    map.addLayer({
      "id": "recycle-thursday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#ff7f00',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "thursday"],

    });
    map.addLayer({
      "id": "recycle-friday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#e41a1c',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "friday"],

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
}else if(e.target.id == 'bulk-layer-button'){
  if(e.target.checked === false){
    e.target.checked = true;
  }else{
    try {
      map.removeLayer('point');
    } catch (e) {
      console.log('No point');
      console.log(e);
    }
    if(document.getElementById('trash-layer-button').checked){
      map.removeLayer('trash-lines');
      map.removeLayer('trash-monday');
      map.removeLayer('trash-tuesday');
      map.removeLayer('trash-wednesday');
      map.removeLayer('trash-thursday');
      map.removeLayer('trash-friday');
      document.getElementById('trash-layer-button').checked = false;
    }else if(document.getElementById('road-layer-button').checked){
      map.removeLayer('main-roads');
      map.removeLayer('residential-roads');
      document.getElementById('road-layer-button').checked = false;
    }else{
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
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "monday"],

    });
    map.addLayer({
      "id": "bulk-tuesday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#4daf4a',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "tuesday"],

    });
    map.addLayer({
      "id": "bulk-wednesday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#984ea3',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "wednesday"],

    });
    map.addLayer({
      "id": "bulk-thursday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#ff7f00',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "thursday"],

    });
    map.addLayer({
      "id": "bulk-friday",
      "type": "fill",
      "source": "waste",
      "layout": {},
      "paint": {
        "fill-color": '#e41a1c',
        "fill-opacity": 0.6,
      },
      "filter": ["==", "day", "friday"],

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
}else{
  // console.log('detecting road');
  if(e.target.checked === false){
    e.target.checked = true;
  }else{
    // console.log('activate roads');
    if(document.getElementById('trash-layer-button').checked){
      map.removeLayer('trash-lines');
      map.removeLayer('trash-monday');
      map.removeLayer('trash-tuesday');
      map.removeLayer('trash-wednesday');
      map.removeLayer('trash-thursday');
      map.removeLayer('trash-friday');
      document.getElementById('trash-layer-button').checked = false;
    }else if (document.getElementById('recycle-layer-button').checked) {
      map.removeLayer('recycle-lines');
      map.removeLayer('recycle-monday');
      map.removeLayer('recycle-tuesday');
      map.removeLayer('recycle-wednesday');
      map.removeLayer('recycle-thursday');
      map.removeLayer('recycle-friday');
      document.getElementById('recycle-layer-button').checked = false;
    }else{
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
};
// document.querySelectorAll('.filter-group input[type=checkbox]').forEach(function(item) {
//   item.addEventListener('click',function(e){
//     toggleMapLayers(e);
//   });
// });
var filtersList = document.querySelectorAll('.filter-group input[type=checkbox]');
for (var i = 0; i < filtersList.length; i++) {
filtersList[i].addEventListener('click', function(e){
  toggleMapLayers(e);
});
}
document.getElementById('close-emergency-modal-btn').addEventListener('click', closeInfo);
var phoneFormater = function phoneFormater(obj){
var numbers = obj.value.replace(/\D/g, ''),
char = {0:'(',3:')',6:'-'};
obj.value = '';
for (var i = 0; i < numbers.length; i++) {
    obj.value += (char[i]||'') + numbers[i];
}
};



var firstLoadCalendar = true;
var today = moment().format();
//console.log("today" , today)
var events = [];
var year = moment().year();
var createEventObject = function createEventObject(data) {
//  console.log ("data from line 7 " , data)
let  tempEventObject = {
  'trash': {
    "dayOfWeek": data.next_pickups.trash.day,
    "schedule": "weekly",
    "AorB": null,
    "startDate": null,
    "endDate": null
  },
  "recycling": {
    "dayOfWeek": null,
    "schedule": "biweekly",
    "AorB": null,
    "startDate": null,
    "endDate": null
  },
  "bulk": {
    "dayOfWeek": null,
    "schedule": "biweekly",
    "AorB": null,
    "startDate": null,
    "endDate": null
  },
  "yard": {
    "dayOfWeek": null,
    "schedule": "biweekly",
    "AorB": null,
    "startDate": null,
    "endDate": null
  }
};
tempEventObject.recycling.dayOfWeek = data.next_pickups.recycling.day;
tempEventObject.recycling.AorB = data.next_pickups.recycling.week;
tempEventObject.recycling.startDate = data.next_pickups.recycling.next_pickup;

tempEventObject.bulk.dayOfWeek = data.next_pickups.bulk.day;
tempEventObject.bulk.AorB = data.next_pickups.bulk.week;
tempEventObject.bulk.startDate = data.next_pickups.bulk.next_pickup;

tempEventObject.trash.dayOfWeek = data.next_pickups.trash.day;
tempEventObject.trash.AorB = data.next_pickups.trash.week;
tempEventObject.trash.startDate = data.next_pickups.trash.next_pickup;

tempEventObject.yard.dayOfWeek = data.next_pickups.trash.day;
tempEventObject.yard.AorB = data.next_pickups.trash.week;

    return tempEventObject;
};
function getWeekNumber(d) {
// Copy date so don't modify original
d = new Date(+d);
d.setHours(0,0,0);
// Set to nearest Thursday: current date + 4 - current day number
// Make Sunday's day number 7
d.setDate(d.getDate() + 4 - (d.getDay()||7));
// Get first day of year
var yearStart = new Date(d.getFullYear(),0,1);
//console.log("new Date(d.getFullYear(),0,1)"+new Date(d.getFullYear(),0,1))
// Calculate full weeks to nearest Thursday
var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
// Return array of year and week number
return [d.getFullYear(), weekNo];
}

function weeksInYear(year) {
var month = 11, day = 31, week;
// Find week that 31 Dec is in. If is first week, reduce date until
// get previous week.
do {
  d = new Date(year, month, day--);
  week = getWeekNumber(d)[1];
} while (week == 1);
return week;
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var addEventToList = function addeEventToList(year,weeks,eventType,eventInfo,startDate, endDate) {
// Add garbage pickup day every week
// console.log(year);
// console.log(weeks);
// console.log(eventType);
// console.log("eventInfo ",eventInfo);
// console.log(startDate);
// console.log(endDate);
for (var i = 1; i < weeks; i++) {
  let title = eventType + ' pick up';
  let eventObj = {
    title : title,
    start : ''
  };
  switch (eventType) {
    case 'Garbage':
        eventObj.color = '#BD0019';
          eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");
      break;

    case 'Recycle':
        eventObj.color = '#068A24';
          eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");
      break;

    case 'Yard waste':
        eventObj.color = '#DF5800';
          eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");
      break;

    case 'Bulk':
        eventObj.color = '#114BC7';
          eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");

      break;
    default:
        //console.log("addto list" + moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD"))
  }
  // console.log(eventObj);
  if(eventInfo.schedule === 'weekly'){
    events.push(eventObj);
  }else{
    if(startDate !== undefined){
      if(moment(eventObj.start).isBetween(startDate, endDate)){
        if((parseInt(moment(eventObj.start).format('YYYY')) % 2) !== 0){
          if(eventInfo.AorB === 'a'){
            (parseInt(moment(eventObj.start).format('W') % 2) === 0) ? events.push(eventObj): 0;
          }else{
              (parseInt(moment(eventObj.start).format('W') % 2) !== 0) ? events.push(eventObj): 0;
          }
        }else{
          if(eventInfo.AorB === 'a'){
            (parseInt(moment(eventObj.start).format('W') % 2) !== 0) ? events.push(eventObj): 0;
          }else{
            (parseInt(moment(eventObj.start).format('W') % 2) === 0) ? events.push(eventObj): 0;
          }
        }
      }
    }else{
      if((parseInt(moment(eventObj.start).format('YYYY')) % 2) !== 0){
        if(eventInfo.AorB === 'a'){
          (parseInt(moment(eventObj.start).format('W') % 2) === 0) ? events.push(eventObj): 0;
        }else{
          (parseInt(moment(eventObj.start).format('W') % 2) !== 0) ? events.push(eventObj): 0;
        }
      }else{
        if(eventInfo.AorB === 'a'){
          (parseInt(moment(eventObj.start).format('W') % 2) !== 0) ? events.push(eventObj): 0;
        }else{
          //console.log("bulk differnce " + eventInfo.startDate + ' '+moment(eventInfo.startDate).format('W') + "  " + moment(eventObj.start).format('W') , moment(eventInfo.startDate).format('W') - moment(eventObj.start).format('W')  );
          (parseInt((moment(eventInfo.startDate).format('W') - moment(eventObj.start).format('W')) % 2) === 0) ? events.push(eventObj): 0;
        }
      }
    }
  }
}
// console.log(events);
};

var loadEmergencyEventInfo = function loadEmergencyEventInfo(emergencyObjArr) {
let tempHtml = '<h3>NOTICE</h3><article id="close-emergency-modal-btn-2"><img src="assets/img/error.png" alt="close"></img></article>';
let alertCount = 0;
emergencyObjArr.forEach(function(item){
  switch (item.type) {
    case 'info':
      tempHtml += '<p><strong>Normal Date:</strong> ' + moment(item.normalDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
      alertCount++;
      break;

    case 'start-date':
      if(moment(item.newDay).month() == moment().month()){
        tempHtml += '<p><strong>Start Date:</strong> ' + moment(item.newDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
        alertCount++;
      }
      break;

    case 'end-date':
      if(moment(item.newDay).month() == moment().month()){
        tempHtml += '<p><strong>End Date:</strong> ' + moment(item.newDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
        alertCount++;
      }
      break;
    default:
      tempHtml += '<p><strong>Normal Date:</strong> ' + moment(item.normalDay).format("dddd, MMMM Do YYYY") + '</p><p><strong>Reschedule Date:</strong> ' + moment(item.newDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
      alertCount++;
  }
});
if(alertCount > 0){
  let tempWidth = window.innerWidth || document.body.clientWidth;
  if(tempWidth > 400){
    document.querySelector('.emergency-container').innerHTML = tempHtml;
    document.getElementById('emergency-modal').className = 'active';
    document.getElementById('close-emergency-modal-btn-2').addEventListener('click', closeDisplayEmergencyEvent);
  }
}
};
var displayEmergencyEvent = function displayEmergencyEvent(emergencyObjArr) {
if(emergencyObjArr.length){
  loadEmergencyEventInfo(emergencyObjArr);
}
};
var closeDisplayEmergencyEvent = function closeDisplayEmergencyEvent() {
document.getElementById('emergency-modal').className = '';
};
var startCalendar = function startCalendar(sendData, routeIDs) {
 //console.log("senddata", sendData);
var listOfEvents = createEventObject(sendData);
//console.log("listOfEvents " , listOfEvents);
// console.log(year);
let todaysMonth =  moment().month() + 1;
let todaysYear = moment().year();

addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Garbage',listOfEvents.trash);
addEventToList((year-1),(weeksInYear((year+1)) + weeksInYear(year) + weeksInYear((year+1))),'Recycle',listOfEvents.recycling);
addEventToList((year-1),(weeksInYear((year+1)) + weeksInYear(year) + weeksInYear((year+1))),'Bulk',listOfEvents.bulk);
// console.log( addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Bulk',listOfEvents.Bulk))
$.ajax({
    url : 'https://apis.detroitmi.gov/waste_schedule/details/' + routeIDs + '/year/' + todaysYear + '/month/' + todaysMonth + '/',
    type : 'GET',
    dataType:'json',
    success : function(response) {
      // console.log(response);
      let yardWasteStart = null;
      let yardWasteEnd = null;
      response.details.forEach(function(item){
        if(item.service == 'yard waste'){
          switch (item.type) {
            case 'end-date':
              listOfEvents.yard.endDate = item.newDay;
              yardWasteStart = item.newDay;
              break;
            default:
              listOfEvents.yard.startDate = item.newDay;
            yardWasteEnd   = item.newDay;
          }
        }
      });
    addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Yard waste',listOfEvents.yard,yardWasteStart,yardWasteEnd);

// console.log("garbage"+(weeksInYear((year+1))));
//  console.log(todaysMonth);
//  console.log(todaysYear);
      //console.log("events", events);
      displayEmergencyEvent(response.details);
      if(firstLoadCalendar){
        //console.log("events 1", events);
        $('#calendar').fullCalendar({
          customButtons: {
               printButton: {
                   text: 'Print',
                   click: function() {
                       window.print();
                   }
               }
           },
          header: {
            left: 'prev,next',
            center: 'title',
            right: 'printButton'
          },
          defaultDate: today,
          navLinks: false, // can click day/week names to navigate views
          // businessHours: true, // display business hours
          editable: true,
          events: events
        });
        firstLoadCalendar = false;
      }else{
            //console.log("events 2", events);
        $('#calendar').fullCalendar( 'addEventSource', events );
      }
    },
    error : function(request,error){
      //console.log("Request: "+JSON.stringify(request));
    }
});
};

var startCalendarServices = function startCalendarServices() {
let tempAddr = document.querySelector('.street-name').innerHTML.split(' ');
let routeIDs = document.querySelector('input[name="route-id"]').value;
let newTempAddr = '';
let size = tempAddr.length;
tempAddr.forEach(function(item, index) {
  newTempAddr += item;
  ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
});
// console.log(newTempAddr);
// console.log(routeIDs);
let lng = document.querySelector('.info-container > input[name="lng"]').value;
let lat = document.querySelector('.info-container > input[name="lat"]').value;
// console.log('lng:' + lng + ', lat:' + lat);
$.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/2019Services/MapServer/0/query?where=&objectIds=&time=&geometry='+lng+'%2C+'+lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data , window) {
  //console.log("start data ",data);
  let todaysMonth =  moment().month() + 1;
  let todaysYear = moment().year();
  url = 'https://apis.detroitmi.gov/waste_schedule/details/' + data.features[0].attributes.FID  + '/year/' + todaysYear + '/month/' + todaysMonth + '/';
  //console.log("url from map ", url);
  $.ajax({
    // TODO change this to https
    url : url,
    type : 'GET',
    dataType:'json',
    success : function(response) {
       //console.log("response  ",response);
       startCalendar(response, routeIDs); //startCalendar(data, routeIDs);

    }
  });

});
};
var closeCalendar = function closeCalendar() {
if(document.querySelector('#box-calendar').className === 'active'){
  document.querySelector('#box-calendar').className = '';
  events.length = 0;
  $('#calendar').fullCalendar('removeEvents');
  (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
}else{
  document.querySelector('#box-calendar').className = 'active';
}
};
var loadCalendarNow = function loadCalendarNow() {
startCalendarServices();
(document.querySelector('#info').className === 'active') ? document.querySelector('#info').className = '' : 0;
closeCalendar();
};
var sendSignUpRequest = function sendSignUpRequest(url, data, success) {
var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); }
    ).join('&');
// console.log(params);
var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
xhr.open('POST', url);
xhr.onload  = function() {
  if (xhr.readyState>3 && Math.trunc(xhr.status / 100) == 2) {
    // console.log('xhr success');
    success(xhr.responseText);
  }else{
    // console.log('xhr error');
    document.querySelector('.invalid-phone-error-message').innerHTML = 'There was an error with your request. Please try again.';
    document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
  }
};
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.addEventListener("error", function(e){
//  console.log(e);
});
xhr.send(params);
return xhr;
};
var stripPhoneNumber = function stripPhoneNumber(number){
let newNumber = '';
// console.log(number.split('('));
newNumber = number.split('(')[1];
// console.log(newNumber);
// console.log(newNumber.split(')'));
newNumber = newNumber.split(')')[0] + newNumber.split(')')[1];
// console.log(newNumber);
// console.log(newNumber.split('-'));
newNumber = newNumber.split('-')[0] + newNumber.split('-')[1];
// console.log(newNumber);
return newNumber;
}
var checkIfPhoneValid = function checkIfPhoneValid(){
let phoneNumber = document.getElementById('phone-number').value;
let a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phoneNumber);
phoneNumber = stripPhoneNumber(phoneNumber);
if(a){
  let routeIDs = '';
  let servicesSignup = '';
  let serviceCheckList = document.querySelectorAll('.service-check > input[type="checkbox"]');
  for (var i = 0; i < serviceCheckList.length; i++) {
    if(serviceCheckList[i].checked){
      routeIDs += serviceCheckList[i].value + ',';
      servicesSignup += serviceCheckList[i].name + ',';
    }
  }
  // console.log(routeIDs);
  if(routeIDs !== ''){
    let data = {
      'phone_number'  : phoneNumber,
      'waste_area_ids': routeIDs,
      'service_type'  : servicesSignup,
      'address' : document.querySelector('.street-name').innerHTML,
      'latitude' :  document.querySelector('.info-container > input[name="lat"]').value,
      'longitude' : document.querySelector('.info-container > input[name="lng"]').value
    };
    // console.log(data);
    sendSignUpRequest('https://apis.detroitmi.gov/waste_notifier/subscribe/', data, function(response){
        // console.log(response);
        document.querySelector('.phone-valid-alert').className = 'phone-valid-alert active';
    });
  }else{
    document.querySelector('.invalid-phone-error-message').innerHTML = 'Plese select one or more services to recive reminders.';
    document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
  }
}else{
  document.querySelector('.invalid-phone-error-message').innerHTML = 'Invalid number. Please enter re-enter you number.';
  document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
}
};
var closePhoneValidationAlert = function closePhoneValidationAlert(alertBox){
alertBox.target.parentNode.className = alertBox.target.parentNode.className.split(' ')[0];
};
// document.querySelectorAll('.close-phone-validation-alert').forEach(function(item){
//   item.addEventListener('click', function(b){
//     closePhoneValidationAlert(b);
//   });
// });
var phoneValidationAlert = document.querySelectorAll('.close-phone-validation-alert');
for (var i = 0; i < phoneValidationAlert.length; i++) {
phoneValidationAlert[i].addEventListener('click', function(b){
  closePhoneValidationAlert(b);
});
}
document.querySelector('#reminder-form > .form_button').addEventListener('click', checkIfPhoneValid);
document.getElementById('back-to-infor-btn').addEventListener('click', closeCalendar);
document.querySelector('.calendar > article').addEventListener('click', loadCalendarNow);
calendarEventsCompleted_Flag = 1;





map.on('click', function (e) {
  console.log(e);
  var features = map.queryRenderedFeatures(e.point, { layers: ['advance-fill'] });
  if (!features.length) {
    features = map.queryRenderedFeatures(e.point, { layers: ['gfl-fill'] });
    console.log(features);
  }
  if (features.length > 0) {
    let tempPoint = {
      coordinates: [e.lngLat.lng, e.lngLat.lat],
      type: "Point"
    };
     console.log(tempPoint);
    map.getSource('single-point').setData(tempPoint);
    map.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
        zoom: 14,
        bearing: 0,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 2, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
            return t;
        }
    });
    //=================== street sweeping ========================
    // $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/Weeks/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+e.lngLat.lng+'%2C'+e.lngLat.lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
    //   console.log(data.features[0].attributes.VISIBLE);
    //   console.log();
    //   console.log(moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-7), 'days').format('MMM,DD'));
    //   console.log(moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-3), 'days').format('MMM,DD'));
    //   document.querySelector('.info-container > .district').innerHTML = '<span>Street Sweeping</span> ' + moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-7), 'days').format('MMM DD') + ' - ' + moment('2017-05-01').add(((data.features[0].attributes.VISIBLE * 7)-3), 'days').format('MMM DD');
    // });
    //=========================== street name ====================
    $.getJSON('https://api.mapbox.com/geocoding/v5/mapbox.places/'+e.lngLat.lng+'%2C'+e.lngLat.lat+'.json?access_token=pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q', function( data ) {
      // console.log(data.features[0].place_name);
      document.querySelector('.info-container > .street-name').innerHTML = data.features[0].place_name.split(',')[0];
    });
    //======================== pick up services ==================
    if(features[0].properties.contractor == 'advance'){
      document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="https://www.advanceddisposal.com/mi/detroit/detroit-residential-collection" target="_new">' + capitalizeFirstLetter(features[0].properties.contractor) + '</a> - <a href="tel:844-233-8764">(844) 233-8764</a>';
    }else{
      document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="http://gflusa.com/residential/detroit/" target="_new">' + capitalizeFirstLetter(features[0].properties.contractor) + '</a> - <a href="tel:844-464-3587">(844) 464-3587</a>';
    }

    document.querySelector('.info-container > input[name="route-id"]').value = features[0].properties.FID;
    document.querySelector('.service-check > #garbage-checkbox').value = features[0].properties.FID;
    document.querySelector('.service-check > #recycle-checkbox').value = features[0].properties.FID;
    document.querySelector('.service-check > #bulk-yard-checkbox').value = features[0].properties.FID;
    document.querySelector('.info-container > input[name="lng"]').value = e.lngLat.lng;
    document.querySelector('.info-container > input[name="lat"]').value = e.lngLat.lat;
    (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
    let todaysMonth =  moment().month() + 1;
    let todaysYear = moment().year();
    $.ajax({
      // TODO change this to https
      url : 'https://apis.detroitmi.gov/waste_schedule/details/' + features[0].properties.FID + '/year/' + todaysYear + '/month/' + todaysMonth + '/',

      type : 'GET',
      dataType:'json',
      success : function(response) {
        //console.log(url)
        console.log(response);
        document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(features[0].properties.day) + ' - ' + moment(response.next_pickups.trash.next_pickup).format('MMM Do');
        document.querySelector('.info-container > .recycle').innerHTML = '<span>Curbside Recycle:</span> ' + capitalizeFirstLetter(features[0].properties.day) + ' - ' + moment(response.next_pickups.recycling.next_pickup).format('MMM Do');
        document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(features[0].properties.day) + ' - ' + moment(response.next_pickups.bulk.next_pickup).format('MMM Do');
        if(response.next_pickups['yard waste'] != undefined){
          document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups['yard waste'].next_pickup).format('MMM Do');
        }else{
          document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> Suspended';
        }
      }

    });
  }else{
    console.log('No data on point');
  }
  return;
});