import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Cal.scss';
export default class Cal {
  constructor(container, _controller) {
    this.calendar = null;
    this._controller = _controller;
    this.init(document.getElementById(container), this);
  }

  init(container, _calendar){
      _calendar.calendar = new Calendar(container, {
        plugins: [ dayGridPlugin ]
      });
      _calendar.calendar.render();
  }
}