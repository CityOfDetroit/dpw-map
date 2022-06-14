import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import moment from 'moment';
import Panel from './Panel';
import Geocoder from './Geocoder';
import Cal from './Cal';
import './App.scss';
import '../../node_modules/leaflet/dist/leaflet.css';

export default class App {
    constructor() {
        this.month = moment().month() + 1;
        this.year = moment().year();
        this.schedule = {
            garbage: null,
            recycle: null,
            bulk:    null,
            yard: {
                start: null,
                end: null
            }
        }
        this.point = null;
        this.map = null;
        this.layers = {};
        this.calendar = new Cal('calendar', this);;
        this.panel = new Panel(this);
        this.geocoder = new Geocoder('geocoder', this);
        this.initialLoad(this);
    }

    initialLoad(_app){
        _app.map = L.map('map').setView([42.36, -83.1], 12);
        esri.basemapLayer('Gray', {
            detectRetina: true
        }).addTo(_app.map);
        _app.layers['wasteRoutes'] = esri.featureLayer({
            url: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/WasteCollectionAreas/FeatureServer/0',
            simplifyFactor: 0.5,
            precision: 5,
            style: function (feature) {
                switch (feature.properties.day) {
                    case 'monday':
                        return { color: '#377eb8', weight: 2 };
                        break;

                    case 'tuesday':
                        return { color: '#4daf4a', weight: 2 };
                        break;

                    case 'wednesday':
                        return { color: '#984ea3', weight: 2 };
                        break;

                    case 'thursday':
                        return { color: '#ff7f00', weight: 2 };
                        break;
                
                    default:
                        return { color: '#e41a1c', weight: 2 };
                        break;
                }
            }
        }).addTo(_app.map);

       

        _app.map.on('click', function (e) {
            _app.queryLayer(_app, 'wasteRoutes',e.latlng);
        });
    }

    queryLayer(_app, layer, latlng){
        let needAdress = false;
        let myIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [25, 35],
            iconAnchor: [25, 35],
            popupAnchor: [-3, -76],
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        });
        let tempLocation = null;
        if(latlng.geometry){
            tempLocation = {lat: latlng.geometry.coordinates[1],lng:  latlng.geometry.coordinates[0]};            
        }else{
            needAdress = true;
            tempLocation = latlng;
        }
        let userPoint = L.layerGroup().addTo(_app.map);
        _app.layers[layer].query().intersects(latlng).run(function (error, featureCollection, response) {
            if (error) {
              console.log(error);
              return;
            }
            if(_app.point){
                _app.point.clearLayers();
                _app.point = userPoint.addLayer(L.marker(tempLocation,{icon: myIcon}));
            }else{ 
                _app.point = userPoint.addLayer(L.marker(tempLocation,{icon: myIcon}));
            }
            _app.map.flyTo(tempLocation, 15);
            _app.panel.currentProvider = featureCollection.features[0].properties.contractor;
            fetch(`https://apis.detroitmi.gov/waste_schedule/details/${featureCollection.features[0].properties.FID}/year/${_app.year}/month/${_app.month}/`)
            .then((res) => {
                res.json().then(data => {
                    data.details.forEach((d)=>{
                        if(d.type == 'start-date' && d.service == 'yard waste'){
                            _app.schedule.yard.start = d.newDay;
                        }
                        if(d.type == 'end-date' && d.service == 'yard waste'){
                            _app.schedule.yard.end = d.newDay;
                        }
                    });
                    _app.schedule.garbage = data.next_pickups.trash.next_pickup;
                    _app.schedule.recycle = data.next_pickups.recycling.next_pickup;
                    _app.schedule.bulk = data.next_pickups.bulk.next_pickup;
                    _app.panel.location.lat = tempLocation.lat;
                    _app.panel.location.lng = tempLocation.lng;
                    _app.panel.data = data;
                    if(needAdress){
                        fetch(`https://gis.detroitmi.gov/arcgis/rest/services/DoIT/StreetCenterlineLatLng/GeocodeServer/reverseGeocode?location=${_app.panel.location.lng}%2C+${_app.panel.location.lat}&distance=&outSR=&f=pjson`)
                        .then((res) => {
                            res.json().then(data => {
                                _app.panel.address = data.address.Street;
                                _app.panel.createPanel(_app.panel);
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                    }else{
                        _app.panel.createPanel(_app.panel);
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
        });
    }

    createCalendar(ev, _app){
        _app.calendar.createCalendar(_app);
    }

    checkParcelValid(parcel){
        return /\d/.test(parcel);
    }
}