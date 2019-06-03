var calendarEvents = (function(){
  var firstLoadCalendar = true;
  var today = moment().format();
  var events = [];
  var year = moment().year();
  var createEventObject = function createEventObject(data) {
    let  tempEventObject = {
      'trash': {
        "dayOfWeek": data.features[0].attributes.day,
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
    if(data.features.length > 1){
      tempEventObject.recycling.dayOfWeek = data.features[1].attributes.day;
      tempEventObject.recycling.AorB = data.features[1].attributes.week;
      tempEventObject.bulk.dayOfWeek = data.features[2].attributes.day;
      tempEventObject.bulk.AorB = data.features[2].attributes.week;
      tempEventObject.yard.dayOfWeek = data.features[2].attributes.day;
      tempEventObject.yard.AorB = data.features[2].attributes.week;
    }else{
      tempEventObject.recycling.dayOfWeek = data.features[0].attributes.day;
      tempEventObject.recycling.AorB = data.features[0].attributes.week;
      tempEventObject.bulk.dayOfWeek = data.features[0].attributes.day;
      tempEventObject.bulk.AorB = data.features[0].attributes.week;
      tempEventObject.yard.dayOfWeek = data.features[0].attributes.day;
      tempEventObject.yard.AorB = data.features[0].attributes.week;
    }
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
  var addEventToList = function addeEventToList(year,weeks,eventType,eventInfo,startDate, endDate) {
    // Add garbage pickup day every week
    console.log(year);
    console.log(weeks);
    console.log(eventType);
    console.log(eventInfo);
    console.log(startDate);
    console.log(endDate);
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

      }
      // console.log(eventObj);
      if(eventInfo.schedule === 'weekly'){
        events.push(eventObj);
      }else{
        if(startDate !== undefined){
          if(moment(eventObj.start).isBetween(startDate, endDate)){
            if((year % 2) !== 0){
              if(eventInfo.AorB === 'a'){
                ((i % 2) === 0) ? events.push(eventObj): 0;
              }else{
                ((i % 2) !== 0) ? events.push(eventObj): 0;
              }
            }else{
              if(eventInfo.AorB === 'a'){
                ((i % 2) !== 0) ? events.push(eventObj): 0;
              }else{
                ((i % 2) === 0) ? events.push(eventObj): 0;
              }
            }
          }
        }else{
          if((year % 2) !== 0){
            if(eventInfo.AorB === 'a'){
              ((i % 2) === 0) ? events.push(eventObj): 0;
            }else{
              ((i % 2) !== 0) ? events.push(eventObj): 0;
            }
          }else{
            if(eventInfo.AorB === 'a'){
              ((i % 2) !== 0) ? events.push(eventObj): 0;
            }else{
              ((i % 2) === 0) ? events.push(eventObj): 0;
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
    console.log(sendData);
    var listOfEvents = createEventObject(sendData);
    console.log(listOfEvents);
    console.log(year);
    let todaysMonth =  moment().month() + 1;
    let todaysYear = moment().year();
    addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Garbage',listOfEvents.trash);
    addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Recycle',listOfEvents.recycling);
    addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Bulk',listOfEvents.bulk);
    //console.log(events);
    $.ajax({
        url : 'https://apis.detroitmi.gov/waste_schedule/details/' + routeIDs + '/year/' + todaysYear + '/month/' + todaysMonth + '/',
        type : 'GET',
        dataType:'json',
        success : function(response) {
          console.log(response);
          let yardWasteStart = null;
          let yardWasteEnd = null;
          response.details.forEach(function(item){
            if(item.service == 'yard waste'){
              switch (item.type) {
                case 'end-date':
                  yardWasteEnd = item.newDay;
                  break;
                default:
                  yardWasteStart = item.newDay;
              }
            }
          });
          addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Yard waste',listOfEvents.yard, yardWasteStart, yardWasteEnd);
          displayEmergencyEvent(response.details);
          if(firstLoadCalendar){
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
            $('#calendar').fullCalendar( 'addEventSource', events );
          }
        },
        error : function(request,error){
          console.log("Request: "+JSON.stringify(request));
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
      // console.log(data);
      startCalendar(data, routeIDs);
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
      console.log(e);
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
})(window);
