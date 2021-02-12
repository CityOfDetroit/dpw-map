import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from 'moment';
import './Cal.scss';
export default class Cal {
  constructor(container, _controller) {
    this.calendar = null;
    this.controller = _controller;
    this.pickups = [];
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
    _app.calendar.buildSchedule(_app);
    _app.calendar.calendar = new Calendar(calContainer, {
      plugins: [ dayGridPlugin ],
      eventSources: _app.calendar.pickups
    });
    _app.calendar.calendar.render();
    document.querySelector('#app .calendar').className = "calendar active";
  }

  buildSchedule(_app){
    _app.calendar.buildPickUps(_app);
  }

  buildPickUps(_app){
    let pastDate = _app.schedule.recycle;
    let latestDate = _app.schedule.recycle;
    let pastTrashDate = _app.schedule.garbage;
    let trashDate = _app.schedule.garbage;

    let gList = {
      events: [
        {
          title  : 'Trash',
          start  : moment(trashDate).format('YYYY-MM-DD'),
        }
      ],
      color: '#cb4d4f',     // an option!
      textColor: 'white' // an option!
    };
    let rList = {
      events: [
        {
          title  : 'Recycle',
          start  : moment(latestDate).format('YYYY-MM-DD'),
        }
      ],
      color: '#9FD5B3',     // an option!
      textColor: '#004445' // an option!
    };
    let bList = {
      events: [
        {
          title  : 'Bulk',
          start  : moment(latestDate).format('YYYY-MM-DD'),
        }
      ],
      color: '#5f355a',     // an option!
      textColor: 'white' // an option!
    };
    let yList = {
      events: [],
      color: '#feb70d',     // an option!
      textColor: 'black' // an option!
    }
    if(moment(latestDate).isBetween(_app.schedule.yard.start, _app.schedule.yard.end)){
      yList.events.push(
        {
          title  : 'Yard',
          start  : moment(latestDate).format('YYYY-MM-DD'),
        }
      );
    }
    for (let index = 0; index < 52; index++) {
      let tempG = {
        title  : 'Trash',
        start  : moment(trashDate).add(7,'d').format('YYYY-MM-DD'),
      };
      let pasttempG = {
        title  : 'Trash',
        start  : moment(pastTrashDate).subtract(7,'d').format('YYYY-MM-DD'),
      };
      trashDate = moment(trashDate).add(7,'d');
      pastTrashDate = moment(pastTrashDate).subtract(7,'d');
      gList.events.push(tempG);
      gList.events.push(pasttempG);
    }

    for (let index = 0; index < 26; index++) {
      let tempR = {
        title  : 'Recycle',
        start  : moment(latestDate).add(14,'d').format('YYYY-MM-DD'),
      };
      let tempB = {
        title  : 'Bulk',
        start  : moment(latestDate).add(14,'d').format('YYYY-MM-DD'),
      };
      if(moment(latestDate).add(14,'d').isBetween(_app.schedule.yard.start, _app.schedule.yard.end)){
        let tempY = {
          title  : 'Yard',
          start  : moment(latestDate).add(14,'d').format('YYYY-MM-DD'),
        };
        yList.events.push(tempY);
      }
      let pasttempR = {
        title  : 'Recycle',
        start  : moment(pastDate).subtract(14,'d').format('YYYY-MM-DD'),
      };
      let pasttempB = {
        title  : 'Bulk',
        start  : moment(pastDate).subtract(14,'d').format('YYYY-MM-DD'),
      };
      if(moment(pastDate).subtract(14,'d').isBetween(_app.schedule.yard.start, _app.schedule.yard.end)){
        let pasttempY = {
          title  : 'Yard',
          start  : moment(pastDate).subtract(14,'d').format('YYYY-MM-DD'),
        };
        yList.events.push(pasttempY);
      }
      pastDate = moment(pastDate).subtract(14,'d');
      latestDate = moment(latestDate).add(14,'d');
      rList.events.push(tempR);
      bList.events.push(tempB);
      rList.events.push(pasttempR);
      bList.events.push(pasttempB);
    }
    _app.calendar.pickups.push(gList);
    _app.calendar.pickups.push(rList);
    _app.calendar.pickups.push(bList);
    _app.calendar.pickups.push(yList);
  }

  closeCalendar(ev,_calendar){
    _calendar.calendar.destroy();
    _calendar.calendar = null;
    _calendar.pickups.length = 0;
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