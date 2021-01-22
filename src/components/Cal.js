import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
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
      <article class='legend'>
        <span class="garbage">Garbage</span> 
        <span class="recycle">Recycle</span> 
        <span class="bulk">Bulk</span> 
        <span class="yard">Yard</span> 
      </article>
    `;
    tempCal.appendChild(calContainer);
    tempCal.prepend(closeBtn);
    _app.calendar.calendar = new Calendar(calContainer, {
      plugins: [ dayGridPlugin ]
    });
    _app.calendar.buildSchedule(_app);
    _app.calendar.calendar.render();
    document.querySelector('#app .calendar').className = "calendar active";
  }

  buildSchedule(_app){
    console.log(_app.schedule);
  }

  closeCalendar(ev,_calendar){
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