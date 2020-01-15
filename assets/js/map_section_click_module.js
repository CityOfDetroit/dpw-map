var mapSectionClickModule = (function(calendarEvents){
  map.on('click', function (e) {
    // console.log(e);
    var features = map.queryRenderedFeatures(e.point, { layers: ['advance-fill'] });
    if (!features.length) {
      features = map.queryRenderedFeatures(e.point, { layers: ['gfl-fill'] });
      // console.log(features);
    }
    if (features.length) {
      let tempPoint = {
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        type: "Point"
      };
      // console.log(tempPoint);
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
          // console.log(response);
          document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(features[0].properties.day) + ' - ' + moment(response.next_pickups.trash.next_pickup).format('MMM Do');
          document.querySelector('.info-container > .recycle').innerHTML = '<span>Curbside Recycle:</span> ' + capitalizeFirstLetter(features[0].properties.day) + ' - ' + moment(response.next_pickups.recycling.next_pickup).format('MMM Do');
          document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(features[0].properties.day) + ' - ' + moment(response.next_pickups.bulk.next_pickup).format('MMM Do');
          (response.next_pickups['yard waste']) ? document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> ' + capitalizeFirstLetter(features[0].properties.day) + ' - ' + moment(response.next_pickups['yard waste'].next_pickup).format('MMM Do') : "";
        }
      });
    }else{
      console.log('No data on point');
    }
    return;
  });
})(window, calendarEvents);
