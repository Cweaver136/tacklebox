import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../login-element/login-element.js'

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

class TackeleboxMobile extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          height: 100%;
          display: flex;
          font-family: var(--paper-font-title_-_font-family)
        }
        .orangeButton {
          background-color: #ffa012;
        }
        #fishingButton {
          color: white;
          font-size: 22px;
          border-radius: 100px;
          height: 200px;
          width: 200px;
        }
        #content {
          display: flex;
          flex-direction: column;
          margin: 10px;
          padding: 0px 25px; 
          border-radius: 10px;
          flex: 1;
          align-items: center;
          justify-content: center;
         }
        #title {
          flex: 1;
          color: #15b9ff
        }
        #loginForm {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center
        }
        .input {
          width: 250px;
        }
        .button {
          background-color: #ffa012;
          border-radius: 50px;
          width: 100px;
          margin: 20px;
        }
        .flex-row {
          display: flex;
        }
        #mainStuff {
          flex-direction: column;
          flex: 1;
          display: flex;
          width: 100%;
          align-items: center
        }
        #appHeader {
          border-bottom: 1px solid lightgray;
          flex: .1;
          display:flex;
          align-items: center;
          text-align: center;
          width: 100%
        }
        #start {
          flex: .8;
          display: flex;
          align-items: center;
        }
        #inProgress {
          display: flex;
          flex: .8;
          width: 100%;
        }
        #buttons {
          border-top: 1px solid lightgray;
          flex: .1;
        }
        #title {
          color: #15b9ff
        }
        login-element[hidden] {
          display: none;
        }
        #start[hidden] {
          display: none;
        }
        #inProgress[hidden] {
          display: none;
        }
        #paused[hidden] {
          display: none;
        }
        #end[hidden] {
          display: none;
        }
      </style>
      <div id="content">
        <login-element hidden\$="[[hasUser(user.*)]]" user="{{user}}"></login-element>
        <template is="dom-if" if="{{user}}">
          <div id="appHeader">
            <h1 id="title">Tacklebox</h1>
          </div>
          <div id="mainStuff">
            <div hidden\$="[[!equal(selectedView, 'start')]]" id="start">
              <paper-button class="orangeButton" id="fishingButton" on-tap="startFishing">Let's Fish</paper-button>
            </div>
            <div hidden\$="[[!equal(selectedView, 'inProgress')]]" id="inProgress">
              <div id="fishingOverview">
                <h3>Time: {{timeElapsed}}</h3>
                <h3>Fish Caught: {{totalFishCaught}}</h3>
              </div>
            </div>
            <div hidden\$="[[!equal(selectedView, 'paused')]]" id="paused"></div>
            <div hidden\$="[[!equal(selectedView, 'end')]]" id="end"></div>
            </div>
          <div>
          <div id="buttons"></div>
        </template>
      </div>
    `;
  }

  static get is() { return 'tacklebox-mobile'; }
  static get properties() {
    return {
      user: {
        type: Object,
        notify: true,
      },
      selectedView: {
        type: String,
        value: 'start'
      }
    };
  }
  static get observers() {
    return [
    ]
  }
  ready() {
    super.ready();
  }
  equal(a, b) {
    return a == b;
  }
  hasUser() {
    console.log(this.user)
    if (this.user) return true;
    else return false;
  }
  startFishing() {
    this.switchView('inProgress');
  }
  switchView(target) {
    this.set('selectedView', target);
  }
}
customElements.define(TackeleboxMobile.is, TackeleboxMobile);