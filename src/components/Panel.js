import moment from 'moment';
import SignForm from './SignForm';
import './Panel.scss';
export default class Panel {
    constructor() {
        this.signup = new SignForm();
        this.currentProvider = null;
        this.providers = {
            gfl : {
                url: 'http://gflusa.com/residential/detroit/',
                phone: '<a href="tel:844-464-3587">(844) 464-3587</a>'
            },
            advance: {
                url: 'https://www.advanceddisposal.com/mi/detroit/detroit-residential-collection',
                phone: '<a href="tel:844-233-8764">(844) 233-8764</a>'
            }
        };
        this.data = null;
    }

    createPanel(_panel){
        let nextPickups = _panel.buildNextPickup(_panel);
        document.querySelector('#panel .panel-box').innerHTML = `
            <h1>Panel</h1>
            <section class="sms-signup-box">
            </section>
            ${nextPickups}
        `;
        _panel.signup.buildForm(_panel);
        document.querySelector('#panel .panel-box .sms-signup-box').appendChild(_panel.signup.form);
    }

    buildNextPickup(_panel){
        console.log(_panel);
        console.log(_panel.data.next_pickups.trash.next_pickup);
        return `
        <section class="waste-services">
        <div class="group">
            <span class="header">Provider</span>
            <p><a href="${_panel.providers[_panel.currentProvider].url}" target="_blank">${_panel.currentProvider}</a> - ${_panel.providers[_panel.currentProvider].phone}</p>
        </div>
        <div class="group">
            <span class="header">Garbage</span>
            <p>${moment(_panel.data.next_pickups.trash.next_pickup).format('dddd - MMM Do')}</p>
        </div>
        <div class="group">
            <span class="header">Curbside Recycl</span>
            <p>${moment(_panel.data.next_pickups.recycling.next_pickup).format('dddd - MMM Do')}</p>
        </div>
        <div class="group">
            <span class="header">Bulk</span>
            <p>${moment(_panel.data.next_pickups.bulk.next_pickup).format('dddd - MMM Do')}</p>
        </div>
        ${(_panel.data.next_pickups['yard waste']) ? `
        <div class="group">
            <span class="header">Yard</span>
            <p>${moment(_panel.data.next_pickups['yard waste'].next_pickup).format('dddd - MMM Do')}</p>
        </div></sections>` : ``}
        `;
    }
}