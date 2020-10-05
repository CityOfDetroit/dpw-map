import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import moment from 'moment';
import Panel from './Panel';
import '../../node_modules/leaflet/dist/leaflet.css';

export default class Controller {
    constructor() {
        this.month = moment().month() + 1;
        this.year = moment().year();
        this.point = null;
        this.map = null;
        this.panel = new Panel();
        this.initialLoad(this);
    }

    initialLoad(_controller){
        _controller.map = L.map('map').setView([42.36, -83.1], 12);
        esri.basemapLayer('Streets').addTo(_controller.map);

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
        }).addTo(_controller.map);

        let userPoint = {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1,
            radius: 20
        };

        _controller.map.on('click', function (e) {
            console.log(e);
            wasteRoutes.query().intersects(e.latlng).run(function (error, featureCollection, response) {
                if (error) {
                  console.log(error);
                  return;
                }
                if(_controller.point){
                    _controller.point.setLatLng(e.latlng);
                }else{
                    _controller.point = L.circle(e.latlng, userPoint).addTo(_controller.map);
                }
                _controller.map.flyTo(e.latlng, 15);
                console.log(featureCollection.features);
                fetch(`https://apis.detroitmi.gov/waste_schedule/details/${featureCollection.features[0].properties.FID}/year/${_controller.year}/month/${_controller.month}/`)
                .then((res) => {
                    res.json().then(data => {
                        console.log(data);
                        _controller.panel.data = data;
                        _controller.panel.createPanel(_controller.panel);
                        document.getElementById('panel').className = "active";
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            });
        });
    }
}