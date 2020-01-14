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
})({"assets/js/module.event.js":[function(require,module,exports) {
var calendarEvents = function () {
  var firstLoadCalendar = true;
  var today = moment().format(); // console.log("today" , today)

  var events = [];
  var year = moment().year();

  var createEventObject = function createEventObject(data) {
    // console.log ("data from line 7 " , data)
    var tempEventObject = {
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
    return tempEventObject;
  };

  function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0); // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7

    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Get first day of year

    var yearStart = new Date(d.getFullYear(), 0, 1); // console.log("new Date(d.getFullYear(),0,1)"+new Date(d.getFullYear(),0,1))
    // Calculate full weeks to nearest Thursday

    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7); // Return array of year and week number

    return [d.getFullYear(), weekNo];
  }

  function weeksInYear(year) {
    var month = 11,
        day = 31,
        week; // Find week that 31 Dec is in. If is first week, reduce date until
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

  var addEventToList = function addeEventToList(year, weeks, eventType, eventInfo, startDate, endDate) {
    // Add garbage pickup day every week
    // console.log(year);
    // console.log(weeks);
    // console.log(eventType);
    // console.log("eventInfo ",eventInfo);
    // console.log(startDate);
    // console.log(endDate);
    for (var i = 1; i < weeks; i++) {
      var title = eventType + ' pick up';
      var eventObj = {
        title: title,
        start: ''
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

        default: // console.log("addto list" + moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD"))

      } // console.log(eventObj);


      if (eventInfo.schedule === 'weekly') {
        events.push(eventObj);
      } else {
        if (startDate !== undefined) {
          if (moment(eventObj.start).isBetween(startDate, endDate)) {
            if (parseInt(moment(eventObj.start).format('YYYY')) % 2 !== 0) {
              if (eventInfo.AorB === 'a') {
                parseInt(moment(eventObj.start).format('W') % 2) === 0 ? events.push(eventObj) : 0;
              } else {
                parseInt(moment(eventObj.start).format('W') % 2) !== 0 ? events.push(eventObj) : 0;
              }
            } else {
              if (eventInfo.AorB === 'a') {
                parseInt(moment(eventObj.start).format('W') % 2) !== 0 ? events.push(eventObj) : 0;
              } else {
                parseInt(moment(eventObj.start).format('W') % 2) === 0 ? events.push(eventObj) : 0;
              }
            }
          }
        } else {
          if (parseInt(moment(eventObj.start).format('YYYY')) % 2 !== 0) {
            if (eventInfo.AorB === 'a') {
              parseInt(moment(eventObj.start).format('W') % 2) === 0 ? events.push(eventObj) : 0;
            } else {
              parseInt(moment(eventObj.start).format('W') % 2) !== 0 ? events.push(eventObj) : 0;
            }
          } else {
            if (eventInfo.AorB === 'a') {
              parseInt(moment(eventObj.start).format('W') % 2) !== 0 ? events.push(eventObj) : 0;
            } else {
              // console.log("bulk differnce " + eventInfo.startDate + ' '+moment(eventInfo.startDate).format('W') + "  " + moment(eventObj.start).format('W') , moment(eventInfo.startDate).format('W') - moment(eventObj.start).format('W')  );
              parseInt((moment(eventInfo.startDate).format('W') - moment(eventObj.start).format('W')) % 2) === 0 ? events.push(eventObj) : 0;
            }
          }
        }
      }
    } // console.log(events);

  };

  var loadEmergencyEventInfo = function loadEmergencyEventInfo(emergencyObjArr) {
    var tempHtml = '<h3>NOTICE</h3><article id="close-emergency-modal-btn-2"><img src="assets/img/error.png" alt="close"></img></article>';
    var alertCount = 0;
    emergencyObjArr.forEach(function (item) {
      switch (item.type) {
        case 'info':
          tempHtml += '<p><strong>Normal Date:</strong> ' + moment(item.normalDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
          alertCount++;
          break;

        case 'start-date':
          if (moment(item.newDay).month() == moment().month()) {
            tempHtml += '<p><strong>Start Date:</strong> ' + moment(item.newDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
            alertCount++;
          }

          break;

        case 'end-date':
          if (moment(item.newDay).month() == moment().month()) {
            tempHtml += '<p><strong>End Date:</strong> ' + moment(item.newDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
            alertCount++;
          }

          break;

        default:
          tempHtml += '<p><strong>Normal Date:</strong> ' + moment(item.normalDay).format("dddd, MMMM Do YYYY") + '</p><p><strong>Reschedule Date:</strong> ' + moment(item.newDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.description + '. ' + item.note + '</p><hr>';
          alertCount++;
      }
    });

    if (alertCount > 0) {
      var tempWidth = window.innerWidth || document.body.clientWidth;

      if (tempWidth > 400) {
        document.querySelector('.emergency-container').innerHTML = tempHtml;
        document.getElementById('emergency-modal').className = 'active';
        document.getElementById('close-emergency-modal-btn-2').addEventListener('click', closeDisplayEmergencyEvent);
      }
    }
  };

  var displayEmergencyEvent = function displayEmergencyEvent(emergencyObjArr) {
    if (emergencyObjArr.length) {
      loadEmergencyEventInfo(emergencyObjArr);
    }
  };

  var closeDisplayEmergencyEvent = function closeDisplayEmergencyEvent() {
    document.getElementById('emergency-modal').className = '';
  };

  var startCalendar = function startCalendar(sendData, routeIDs) {
    //  console.log("senddata", sendData);
    var listOfEvents = createEventObject(sendData); // console.log("listOfEvents " , listOfEvents);
    // console.log(year);

    var todaysMonth = moment().month() + 1;
    var todaysYear = moment().year();
    addEventToList(year - 1, weeksInYear(year - 1) + weeksInYear(year) + weeksInYear(year + 1), 'Garbage', listOfEvents.trash);
    addEventToList(year - 1, weeksInYear(year + 1) + weeksInYear(year) + weeksInYear(year + 1), 'Recycle', listOfEvents.recycling);
    addEventToList(year - 1, weeksInYear(year + 1) + weeksInYear(year) + weeksInYear(year + 1), 'Bulk', listOfEvents.bulk); // console.log( addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Bulk',listOfEvents.Bulk))

    $.ajax({
      url: 'https://apis.detroitmi.gov/waste_schedule/details/' + routeIDs + '/year/' + todaysYear + '/month/' + todaysMonth + '/',
      type: 'GET',
      dataType: 'json',
      success: function success(response) {
        // console.log(response);
        var yardWasteStart = null;
        var yardWasteEnd = null;
        response.details.forEach(function (item) {
          if (item.service == 'yard waste') {
            switch (item.type) {
              case 'end-date':
                listOfEvents.yard.endDate = item.newDay;
                yardWasteEnd = item.newDay;
                break;

              default:
                listOfEvents.yard.startDate = item.newDay;
                yardWasteStart = item.newDay;
            }
          }
        }); //  addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Yard waste',listOfEvents.yard);
        // console.log("garbage"+(weeksInYear((year+1))));
        //  console.log(todaysMonth);
        //  console.log(todaysYear);
        //console.log("events", events);

        displayEmergencyEvent(response.details);

        if (firstLoadCalendar) {
          // console.log("events 1", events);
          $('#calendar').fullCalendar({
            customButtons: {
              printButton: {
                text: 'Print',
                click: function click() {
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
            navLinks: false,
            // can click day/week names to navigate views
            // businessHours: true, // display business hours
            editable: true,
            events: events
          });
          firstLoadCalendar = false;
        } else {
          // console.log("events 2", events);
          $('#calendar').fullCalendar('addEventSource', events);
        }
      },
      error: function error(request, _error) {
        console.log("Request: " + JSON.stringify(request));
      }
    });
  };

  var startCalendarServices = function startCalendarServices() {
    var tempAddr = document.querySelector('.street-name').innerHTML.split(' ');
    var routeIDs = document.querySelector('input[name="route-id"]').value;
    var newTempAddr = '';
    var size = tempAddr.length;
    tempAddr.forEach(function (item, index) {
      newTempAddr += item;
      index < size && index + 1 !== size ? newTempAddr += '+' : 0;
    }); // console.log(newTempAddr);
    // console.log(routeIDs);

    var lng = document.querySelector('.info-container > input[name="lng"]').value;
    var lat = document.querySelector('.info-container > input[name="lat"]').value; // console.log('lng:' + lng + ', lat:' + lat);

    $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DPW/2019Services/MapServer/0/query?where=&objectIds=&time=&geometry=' + lng + '%2C+' + lat + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson', function (data, window) {
      // console.log("start data ",data);
      var todaysMonth = moment().month() + 1;
      var todaysYear = moment().year();
      url = 'https://apis.detroitmi.gov/waste_schedule/details/' + data.features[0].attributes.FID + '/year/' + todaysYear + '/month/' + todaysMonth + '/'; // console.log("url from map ", url);

      $.ajax({
        // TODO change this to https
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function success(response) {
          //  console.log("response  ",response);
          startCalendar(response, routeIDs); //startCalendar(data, routeIDs);
        }
      });
    });
  };

  var closeCalendar = function closeCalendar() {
    if (document.querySelector('#box-calendar').className === 'active') {
      document.querySelector('#box-calendar').className = '';
      events.length = 0;
      $('#calendar').fullCalendar('removeEvents');
      document.querySelector('#info').className === 'active' ? 0 : document.querySelector('#info').className = 'active';
    } else {
      document.querySelector('#box-calendar').className = 'active';
    }
  };

  var loadCalendarNow = function loadCalendarNow() {
    startCalendarServices();
    document.querySelector('#info').className === 'active' ? document.querySelector('#info').className = '' : 0;
    closeCalendar();
  };

  var sendSignUpRequest = function sendSignUpRequest(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&'); // console.log(params);

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);

    xhr.onload = function () {
      if (xhr.readyState > 3 && Math.trunc(xhr.status / 100) == 2) {
        // console.log('xhr success');
        success(xhr.responseText);
      } else {
        // console.log('xhr error');
        document.querySelector('.invalid-phone-error-message').innerHTML = 'There was an error with your request. Please try again.';
        document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
      }
    };

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.addEventListener("error", function (e) {// console.log(e);
    });
    xhr.send(params);
    return xhr;
  };

  var stripPhoneNumber = function stripPhoneNumber(number) {
    var newNumber = ''; // console.log(number.split('('));

    newNumber = number.split('(')[1]; // console.log(newNumber);
    // console.log(newNumber.split(')'));

    newNumber = newNumber.split(')')[0] + newNumber.split(')')[1]; // console.log(newNumber);
    // console.log(newNumber.split('-'));

    newNumber = newNumber.split('-')[0] + newNumber.split('-')[1]; // console.log(newNumber);

    return newNumber;
  };

  var checkIfPhoneValid = function checkIfPhoneValid() {
    var phoneNumber = document.getElementById('phone-number').value;
    var a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phoneNumber);
    phoneNumber = stripPhoneNumber(phoneNumber);

    if (a) {
      var routeIDs = '';
      var servicesSignup = '';
      var serviceCheckList = document.querySelectorAll('.service-check > input[type="checkbox"]');

      for (var i = 0; i < serviceCheckList.length; i++) {
        if (serviceCheckList[i].checked) {
          routeIDs += serviceCheckList[i].value + ',';
          servicesSignup += serviceCheckList[i].name + ',';
        }
      } // console.log(routeIDs);


      if (routeIDs !== '') {
        var data = {
          'phone_number': phoneNumber,
          'waste_area_ids': routeIDs,
          'service_type': servicesSignup,
          'address': document.querySelector('.street-name').innerHTML,
          'latitude': document.querySelector('.info-container > input[name="lat"]').value,
          'longitude': document.querySelector('.info-container > input[name="lng"]').value
        }; // console.log(data);

        sendSignUpRequest('https://apis.detroitmi.gov/waste_notifier/subscribe/', data, function (response) {
          // console.log(response);
          document.querySelector('.phone-valid-alert').className = 'phone-valid-alert active';
        });
      } else {
        document.querySelector('.invalid-phone-error-message').innerHTML = 'Plese select one or more services to recive reminders.';
        document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
      }
    } else {
      document.querySelector('.invalid-phone-error-message').innerHTML = 'Invalid number. Please enter re-enter you number.';
      document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
    }
  };

  var closePhoneValidationAlert = function closePhoneValidationAlert(alertBox) {
    alertBox.target.parentNode.className = alertBox.target.parentNode.className.split(' ')[0];
  }; // document.querySelectorAll('.close-phone-validation-alert').forEach(function(item){
  //   item.addEventListener('click', function(b){
  //     closePhoneValidationAlert(b);
  //   });
  // });


  var phoneValidationAlert = document.querySelectorAll('.close-phone-validation-alert');

  for (var i = 0; i < phoneValidationAlert.length; i++) {
    phoneValidationAlert[i].addEventListener('click', function (b) {
      closePhoneValidationAlert(b);
    });
  }

  document.querySelector('#reminder-form > .form_button').addEventListener('click', checkIfPhoneValid);
  document.getElementById('back-to-infor-btn').addEventListener('click', closeCalendar);
  document.querySelector('.calendar > article').addEventListener('click', loadCalendarNow);
}(window);
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
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/module.event.js"], null)
//# sourceMappingURL=/module.event.3eb57239.js.map