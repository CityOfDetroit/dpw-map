import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from 'moment';
import { buildWasteAPI, PICKUP_TYPES, PICKUP_TYPES_PRINT } from '../utils/WasteAPI';
import './Cal.scss';
export default class Cal {
  constructor(container, _controller) {
    this.calendar = null;
    this.controller = _controller;
  }

  createCalendar(_app){
    let tempCal = document.querySelector('.calendar .calendar-box');
    let closeBtn = document.createElement('button');
    closeBtn.innerText = 'x';
    closeBtn.className = 'close-section-btn';
    closeBtn.addEventListener("click", function(e){
        e.preventDefault();
        _app.calendar.closeCalendar(e, _app.calendar);
    });
    let calContainer = document.createElement('article');
    calContainer.id = 'calendar';
    tempCal.innerHTML = `
      <article class='cal-legend'>
        <span class="garbage">Garbage</span> 
        <span class="recycle">Recycle</span> 
        <span class="bulk">Bulk</span> 
        <span class="yard">Yard</span> 
      </article>
    `;
    tempCal.appendChild(calContainer);
    tempCal.prepend(closeBtn);
    _app.calendar.calendar = new Calendar(calContainer, {
      plugins: [ dayGridPlugin ],
      showNonCurrentDates: false,
      eventSources: [
        {
          events: this.fetchTrashPickups.bind(this),
          color: '#cb4d4f',
          textColor: 'white'
        },
        {
          events: this.fetchRecyclingPickups.bind(this),
          color: '#9FD5B3',
          textColor: '#004445'
        },
        {
          events: this.fetchBulkPickups.bind(this),
          color: '#5f355a',
          textColor: 'white'
        },
        {
          events: this.fetchYardPickups.bind(this),
          color: '#feb70d',
          textColor: 'black'
        }
      ],
    });
    _app.calendar.calendar.render();
    document.querySelector('#app .calendar').className = "calendar active";
  }

  fetchPickups(info, successCb, failureCb, pickupType, routeNum, eventBuilder) {
    const month = info.start.getMonth() + 1;
    const wasteAPIEndpoint = buildWasteAPI(routeNum, info.start.getFullYear(), month);
    fetch(wasteAPIEndpoint)
    .then((res) => {
      res.json().then((data) => {
        const events = eventBuilder(data, pickupType);
        successCb(events);
      })
    })
    .catch((error) => {
      console.error(error);
      failureCb(error);
    });
  }

  fetchTrashPickups(info, successCb, failureCb) {
    this.fetchPickups(
      info,
      successCb,
      failureCb,
      PICKUP_TYPES.TRASH,
      this.controller.routeNum,
      this.buildPickUps
    );
  }

  fetchRecyclingPickups(info, successCb, failureCb) {
    this.fetchPickups(
      info,
      successCb,
      failureCb,
      PICKUP_TYPES.RECYCLING,
      this.controller.routeNum,
      this.buildPickUps
    );
  }

  fetchYardPickups(info, successCb, failureCb) {
    this.fetchPickups(
      info,
      successCb,
      failureCb,
      PICKUP_TYPES.YARD_WASTE,
      this.controller.routeNum,
      this.buildPickUps
    );
  }

  fetchBulkPickups(info, successCb, failureCb) {
    this.fetchPickups(
      info,
      successCb,
      failureCb,
      PICKUP_TYPES.BULK,
      this.controller.routeNum,
      this.buildPickUps
    );
  }

  buildPickUps(eventData, pickupType){
    let events = [];
    eventData.schedule.forEach((pickupDateDetails) => {
      for (const [pickupDate, pickupTypeDetails] of Object.entries(pickupDateDetails)) {
        if (pickupType in pickupTypeDetails) {
          events.push(
            {
              title  : PICKUP_TYPES_PRINT[pickupType],
              start  : moment(pickupDate).format('YYYY-MM-DD'),
            }
          );
        }
      }
    });
    return events;
  }

  closeCalendar(ev,_calendar){
    _calendar.calendar.destroy();
    _calendar.calendar = null;
    let tempClass = ev.target.parentNode.parentNode.className;
    tempClass = tempClass.split(' ');
    ev.target.parentNode.parentNode.className = tempClass[0];
    try {
        while (ev.target.parentNode.firstChild) {
            ev.target.parentNode.removeChild(ev.target.parentNode.firstChild);
        }
    } catch (error) {
        
    }
  }
}