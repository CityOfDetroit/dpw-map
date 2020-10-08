import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import moment from 'moment';
import Panel from './Panel';
import Geocoder from './Geocoder';
import './App.scss';
import '../../node_modules/leaflet/dist/leaflet.css';

export default class App {
    constructor() {
        this.month = moment().month() + 1;
        this.year = moment().year();
        this.point = null;
        this.map = null;
        this.panel = new Panel();
        this.geocoder = new Geocoder('geocoder', this);
        this.initialLoad(this);
    }

    initialLoad(_app){
        _app.map = L.map('map').setView([42.36, -83.1], 12);
        esri.basemapLayer('Streets').addTo(_app.map);

        let wasteRoutes = esri.featureLayer({
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

        let userPoint = {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1,
            radius: 20
        };

        _app.map.on('click', function (e) {
            console.log(e);
            wasteRoutes.query().intersects(e.latlng).run(function (error, featureCollection, response) {
                if (error) {
                  console.log(error);
                  return;
                }
                if(_app.point){
                    _app.point.setLatLng(e.latlng);
                }else{
                    _app.point = L.circle(e.latlng, userPoint).addTo(_app.map);
                }
                _app.map.flyTo(e.latlng, 15);
                _app.panel.currentProvider = featureCollection.features[0].properties.contractor;
                console.log(featureCollection.features);
                fetch(`https://apis.detroitmi.gov/waste_schedule/details/${featureCollection.features[0].properties.FID}/year/${_app.year}/month/${_app.month}/`)
                .then((res) => {
                    res.json().then(data => {
                        console.log(data);
                        _app.panel.location.lat = e.latlng.lat;
                        _app.panel.location.lng = e.latlng.lng;
                        _app.panel.data = data;
                        _app.panel.createPanel(_app.panel);
                        document.querySelector('#app .panel').className = "panel active";
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            });
        });
    }

    checkParcelValid(parcel){
        return /\d/.test(parcel);
    }
}