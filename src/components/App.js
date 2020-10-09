import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import moment from 'moment';
import Panel from './Panel';
import Geocoder from './Geocoder';
import './App.scss';
import '../../node_modules/leaflet/dist/leaflet.css';
const markerIcon = require('../../node_modules/leaflet/dist/images/marker-icon.png');
const markerIconShadow = require('../../node_modules/leaflet/dist/images/marker-shadow.png');

export default class App {
    constructor() {
        this.month = moment().month() + 1;
        this.year = moment().year();
        this.point = null;
        this.map = null;
        this.layers = {};
        this.panel = new Panel();
        this.geocoder = new Geocoder('geocoder', this);
        this.initialLoad(this);
    }

    initialLoad(_app){
        _app.map = L.map('map').setView([42.36, -83.1], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(_app.map);

        _app.layers['wasteRoutes'] = esri.featureLayer({
            url: 'https://gis.detroitmi.gov/arcgis/rest/services/DPW/2019Services/MapServer/0',
            simplifyFactor: 0.5,
            precision: 5,
            style: function (feature) {
                switch (feature.properties.day) {
                    case 'monday':
                        return { color: 'blue', weight: 2 };
                        break;

                    case 'tuesday':
                        return { color: 'red', weight: 2 };
                        break;

                    case 'wednesday':
                        return { color: 'green', weight: 2 };
                        break;

                    case 'thursday':
                        return { color: 'yellow', weight: 2 };
                        break;
                
                    default:
                        return { color: 'purple', weight: 2 };
                        break;
                }
            }
        }).addTo(_app.map);

       

        _app.map.on('click', function (e) {
            console.log(e);
            _app.queryLayer(_app, 'wasteRoutes',e.latlng);
        });
    }

    queryLayer(_app, layer, latlng){
        console.log(latlng);
        let needAdress = false;
        let myIcon = L.icon({
            iconUrl: markerIcon,
            iconSize: [25, 35],
            iconAnchor: [25, 35],
            popupAnchor: [-3, -76],
            shadowUrl: markerIconShadow,
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
            console.log(featureCollection.features);
            fetch(`https://apis.detroitmi.gov/waste_schedule/details/${featureCollection.features[0].properties.FID}/year/${_app.year}/month/${_app.month}/`)
            .then((res) => {
                res.json().then(data => {
                    console.log(data);
                    _app.panel.location.lat = tempLocation.lat;
                    _app.panel.location.lng = tempLocation.lng;
                    _app.panel.data = data;
                    if(needAdress){
                        fetch(`https://gis.detroitmi.gov/arcgis/rest/services/DoIT/StreetCenterlineLatLng/GeocodeServer/reverseGeocode?location=${_app.panel.location.lng}%2C+${_app.panel.location.lat}&distance=&outSR=&f=pjson`)
                        .then((res) => {
                            res.json().then(data => {
                                console.log(data);
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

    checkParcelValid(parcel){
        return /\d/.test(parcel);
    }
}