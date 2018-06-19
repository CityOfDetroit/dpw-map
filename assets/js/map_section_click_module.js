var mapSectionClickModule = (function(calendarEvents){
  map.on('click', function (e) {
    console.log(e);
    var features = map.queryRenderedFeatures(e.point, { layers: ['advance-fill'] });
    if (!features.length) {
      features = map.queryRenderedFeatures(e.point, { layers: ['gfl-fill'] });
      console.log(features);
      if (features.length) {
        let tempPoint = {
          coordinates: [e.lngLat.lng, e.lngLat.lat],
          type: "Point"
        };
        console.log(tempPoint);
        map.getSource('single-point').setData(tempPoint);
        let feature = features[0];
        console.log(feature);
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
          console.log(data.features[0].place_name);
          document.querySelector('.info-container > .street-name').innerHTML = data.features[0].place_name.split(',')[0];
        });
        //======================== pick up services ==================
        $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/All_Services/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+e.lngLat.lng+'%2C+'+e.lngLat.lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
          console.log(data);
          document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="http://gflusa.com/residential/detroit/" target="_new">' + capitalizeFirstLetter(data.features[0].attributes.contractor) + '</a> - (844) 464-3587';
          document.querySelector('.info-container > input[name="route-id"]').value = data.features[0].attributes.FID;
          document.querySelector('.service-check > #garbage-checkbox').value = data.features[0].attributes.FID;
          document.querySelector('.service-check > #recycle-checkbox').value = data.features[0].attributes.FID;
          document.querySelector('.service-check > #bulk-yard-checkbox').value = data.features[0].attributes.FID;
          document.querySelector('.info-container > input[name="lng"]').value = e.lngLat.lng;
          document.querySelector('.info-container > input[name="lat"]').value = e.lngLat.lat;
          (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
          let todaysMonth =  moment().month() + 1;
          let todaysYear = moment().year();
          $.ajax({
            // TODO change this to https
            url : 'https://apis.detroitmi.gov/waste_schedule/details/' + data.features[0].attributes.FID + '/year/' + todaysYear + '/month/' + todaysMonth + '/',
            type : 'GET',
            dataType:'json',
            success : function(response) {
              console.log(response);
              document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.trash.next_pickup).format('MMM Do');
              document.querySelector('.info-container > .recycle').innerHTML = '<span>Curbside Recycle:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.recycling.next_pickup).format('MMM Do');
              document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.bulk.next_pickup).format('MMM Do');
              document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups['yard waste'].next_pickup).format('MMM Do');
            }
          });
        });
        // $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/council_district/MapServer/1/query?where=&text=&objectIds=&time=&geometry='+e.lngLat.lng+'%2C+'+e.lngLat.lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
        //   console.log(data.features[0].attributes.districts);
        //   let tempHtml = '<span>District ' + data.features[0].attributes.districts + '</span> ';
        //   switch (data.features[0].attributes.districts) {
        //     case '1':
        //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/James-Tate" target="_new">James Tate</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district1" target="_new"> Stephanie Young</a>';
        //       break;
        //
        //     case '2':
        //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/George-Cushingberry" target="_new">George Cushingberry Jr.</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district2" target="_new"> Kim Tandy</a>';
        //       break;
        //
        //     case '3':
        //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Scott-Benson" target="_new">Scott Benson</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district3" target="_new"> Erinn Harris</a>';
        //       break;
        //
        //     case '4':
        //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Andre-Spivey" target="_new">André L. Spivey</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district4" target="_new"> Letty Azar</a>';
        //       break;
        //
        //     case '5':
        //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Mary-Sheffield" target="_new">Mary Sheffield</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district5" target="_new"> Vince Keenan</a>';
        //       break;
        //
        //     case '6':
        //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Raquel-Castaneda-Lopez" target="_new">Raquel Castañeda-López</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district6" target="_new"> Ray Solomon II</a>';
        //       break;
        //
        //     default:
        //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Gabe-Leland" target="_new">Gabe Leland</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district7" target="_new"> Ray Solomon II</a>';
        //   }
        //   document.querySelector('.info-container > .district').innerHTML = tempHtml;
        // });
      }else{
        console.log('No data on point');
      }
      return;
    }else{
      let tempPoint = {
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        type: "Point"
      };
      console.log(tempPoint);
      map.getSource('single-point').setData(tempPoint);
      let feature = features[0];
      console.log(feature);
      map.flyTo({
          center: [e.lngLat.lng, e.lngLat.lat],
          zoom: 14,
          bearing: 0,
          speed: 2,
          curve: 1,
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
        console.log(data.features[0].place_name);
        document.querySelector('.info-container > .street-name').innerHTML = data.features[0].place_name.split(',')[0];
      });
      //======================== pick up services ==================
      $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/All_Services/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+e.lngLat.lng+'%2C+'+e.lngLat.lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
        console.log(data);
        document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> <a href="https://www.advanceddisposal.com/mi/detroit/detroit-residential-collection" target="_new">' + capitalizeFirstLetter(data.features[0].attributes.contractor) + '</a> - (844) 233-8764';
        // document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day);
        // document.querySelector('.info-container > .recycle').innerHTML = '<span>Curbside Recycle:</span> ' + capitalizeFirstLetter(data.features[1].attributes.day) + '-' + capitalizeFirstLetter(data.features[1].attributes.week);
        // document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[2].attributes.day) + '-' + capitalizeFirstLetter(data.features[2].attributes.week);
        // document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> ' + capitalizeFirstLetter(data.features[2].attributes.day) + '-' + capitalizeFirstLetter(data.features[2].attributes.week);
        document.querySelector('.info-container > input[name="route-id"]').value = data.features[0].attributes.FID + ',' + data.features[1].attributes.FID + ',' + data.features[2].attributes.FID;
        document.querySelector('.service-check > #garbage-checkbox').value = data.features[0].attributes.FID;
        document.querySelector('.service-check > #recycle-checkbox').value = data.features[1].attributes.FID;
        document.querySelector('.service-check > #bulk-yard-checkbox').value = data.features[2].attributes.FID;
        document.querySelector('.info-container > input[name="lng"]').value = e.lngLat.lng;
        document.querySelector('.info-container > input[name="lat"]').value = e.lngLat.lat;
        (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
        let todaysMonth =  moment().month() + 1;
        let todaysYear = moment().year();
        $.ajax({
          // TODO change this to https
          url : 'https://apis.detroitmi.gov/waste_schedule/details/' + data.features[0].attributes.FID + ',' + data.features[1].attributes.FID + ',' + data.features[2].attributes.FID + '/year/' + todaysYear + '/month/' + todaysMonth + '/',
          type : 'GET',
          dataType:'json',
          success : function(response) {
            console.log(response);
            document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + ' - ' + moment(response.next_pickups.trash.next_pickup).format('MMM Do');
            document.querySelector('.info-container > .recycle').innerHTML = '<span>Curbside Recycle:</span> ' + capitalizeFirstLetter(data.features[1].attributes.day) + ' - ' + moment(response.next_pickups.recycling.next_pickup).format('MMM Do');
            document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[2].attributes.day) + ' - ' + moment(response.next_pickups.bulk.next_pickup).format('MMM Do');
            document.querySelector('.info-container > .yard').innerHTML = '<span>Yard Waste:</span> ' + capitalizeFirstLetter(data.features[2].attributes.day) + ' - ' + moment(response.next_pickups['yard waste'].next_pickup).format('MMM Do');
          }
        });
      });
      // $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/council_district/MapServer/1/query?where=&text=&objectIds=&time=&geometry='+e.lngLat.lng+'%2C+'+e.lngLat.lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
      //   console.log(data.features[0].attributes.districts);
      //   let tempHtml = '<span>District ' + data.features[0].attributes.districts + '</span> ';
      //   switch (data.features[0].attributes.districts) {
      //     case '1':
      //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/James-Tate" target="_new">James Tate</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district1" target="_new"> Stephanie Young</a>';
      //       break;
      //
      //     case '2':
      //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/George-Cushingberry" target="_new">George Cushingberry Jr.</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district2" target="_new"> Kim Tandy</a>';
      //       break;
      //
      //     case '3':
      //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Scott-Benson" target="_new">Scott Benson</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district3" target="_new"> Erinn Harris</a>';
      //       break;
      //
      //     case '4':
      //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Andre-Spivey" target="_new">André L. Spivey</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district4" target="_new"> Letty Azar</a>';
      //       break;
      //
      //     case '5':
      //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Mary-Sheffield" target="_new">Mary Sheffield</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district5" target="_new"> Vince Keenan</a>';
      //       break;
      //
      //     case '6':
      //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Raquel-Castaneda-Lopez" target="_new">Raquel Castañeda-López</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district6" target="_new"> Ray Solomon II</a>';
      //       break;
      //
      //     default:
      //       tempHtml += 'Council: <a href="http://www.detroitmi.gov/Government/City-Council/Gabe-Leland" target="_new">Gabe Leland</a><br>District Manager: <a href="http://www.detroitmi.gov/Neighborhoods#dt-district7" target="_new"> Ray Solomon II</a>';
      //   }
      //   document.querySelector('.info-container > .district').innerHTML = tempHtml;
      // });
    }
  });
})(window, calendarEvents);
