export default class Panel {
    constructor() {
        this.data = null;
    }

    createPanel(_panel){
        document.querySelector('#panel .panel-box').innerHTML = `<h1>Panel</h1>`;
    }
}