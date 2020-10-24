import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../login-element/login-element.js'
import '../../helpers/style-modules/flex-styles'

class TackeleboxMobile extends PolymerElement {
  static get template() {
    return html`
      <style include="flex-styles">
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
          height: 150px;
          width: 150px;
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
        #mainContainer {
          display: flex;
          flex-direction: column;
          flex: 1;
          display: flex;
          width: 100%;
          align-items: center
        }
        #mainContainer > .contentContainer {
          flex: 1;
          width: 100%;
        }
        #appHeader {
          border-bottom: 1px solid lightgray;
          flex: .1;
          display:flex;
          align-items: center;
          text-align: center;
          width: 100%
        }
        .button[disabled] {
          background-color: white;
          border: 1px solid lightgray;
          color: black;
          opacity: .6
        }
        #buttons {
          border-top: 1px solid lightgray;
          flex: .1;
        }
        #title {
          color: #15b9ff
        }
        [hidden] {
          display: none;
        }
      </style>
      <div id="content">
        <login-element hidden\$="[[hasUser(user.*)]]" user="{{user}}"></login-element>
        <template is="dom-if" if="{{user}}">
          <div id="appHeader">
            <h1 id="title">Tacklebox</h1>
          </div>
          <div id="mainContainer">
            <div class="contentContainer flex-col-center-vh" hidden\$="[[!equal(selectedView, 'start')]]" id="start">
              <span>Pick your body of water</span>
              <paper-dropdown-menu label="Body of Water" vertical-offset="55" style="margin: 30px 0px 50px 0px;">
                <paper-listbox slot="dropdown-content" selected="{{selectedBOW}}">
                  <template is="dom-repeat" items="{{bodiesOfWater}}">
                    <paper-item>{{item}}</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>
              <paper-button class="button orangeButton" disabled="{{!canStartFishing}}" id="fishingButton" on-tap="startFishing">Let's Fish</paper-button>
            </div>
            <div class="contentContainer flex-col" hidden\$="[[!equal(selectedView, 'inProgress')]]" id="inProgress">
              <div id="fishingOverview">
                <h3>Time: {{timeElapsed}}</h3>
                <h3>Fish Caught: {{numFishCaught}}</h3>
              </div>
            </div>
            <div class="contentContainer" hidden\$="[[!equal(selectedView, 'paused')]]" id="paused"></div>
            <div class="contentContainer" hidden\$="[[!equal(selectedView, 'end')]]" id="end"></div>
          <div>
          <div id="buttons" hidden\$="[[equal(selectedView, 'start')]]">
            <paper-button on-tap="changePage" class="button">Pause</paper-button>
            <paper-button disabled="{{!canContinue}}" class="button" on-tap="endFishing">End</paper-button>
          </div>
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
      },
      canStartFishing: {
        type: Boolean,
        value: false
      },
      numFishCaught: {
        type: Number,
        value: 0,
      },
      sessionTimer: {
        type: Number,
        value: 0
      },
      bodiesOfWater: {
        type: Array,
        value: [
          'Conewago Creek',
          'Susquehanna River',
          'Yellow Breeches Creek'
        ]
      }
    };
  }
  static get observers() {
    return [
      'calcStartFishing(selectedBOW.*)'
    ]
  }
  ready() {
    super.ready();
  }
  equal(a, b) {
    console.log(a, b)
    return a == b;
  }
  hasUser() {
    if (this.user) return true;
    else return false;
  }
  calcStartFishing() {
    if (this.bodiesOfWater[this.selectedBOW]) this.canStartFishing = true;
    else return this.canStartFishing = false;
  }
  startFishing() {
    this.switchView('inProgress');
    let key = firebase.database().ref(`users/${this.user.uid}/sessions`).push().key
    let update = {}
    let lat;
    let long;
    // get location of starting spot
    navigator.geolocation.getCurrentPosition(function(location) {
      lat = location.coords.latitude,
      long = location.coords.longitude
    });
    

    let waterData = {}
    fetch('https://waterservices.usgs.gov/nwis/iv/?sites=01571500&format=json').then(response => response.json()).then(data => {
      waterData.flowRate = data.value.timeSeries[0].values[0].value[0].value;
      update['users/' + this.user.uid + '/sessions/' + key] = true;
      update['sessions/' + key] = {
        uid: this.user.uid,
        date: new Date().getTime(),
        body_of_water: this.bodiesOfWater[this.selectedBOW],
        start_location: {
          lat,
          long
        }
      }
      firebase.database().ref().update(update).then(() => {
        this.set('sessionId', key)
      }).catch(e => {
        console.log(e)
      })
    });
  }
  endFishing() {
    let update = {};
    let lat;
    let long;
    // get location of starting spot
    navigator.geolocation.getCurrentPosition(function(location) {
      lat = location.coords.latitude,
      long = location.coords.longitude
    });

    let waterData = {}
    fetch('https://waterservices.usgs.gov/nwis/iv/?sites=01571500&format=json').then(response => response.json()).then(data => {
      var endFlowData = data.value.timeSeries[0].values[0].value[0].value;
      // waterData.flowRate = (parseInt(endFlowData) + parseInt(this.state.flowData)) / 2
      waterData.location = {
        lat: data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.latitude,
        lng: data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.longitude
      }
      update['end_location'] = {
        lat,
        long
      }
      firebase.database().ref(`sessions/${this.sessionId}`).update(update).then(() => {
        this.sessionId = null;
        this.numFishCaught = 0;
        this.selectedView = 'end'
      })
    });
  }
  switchView(target) {
    this.set('selectedView', target);
  }
}
customElements.define(TackeleboxMobile.is, TackeleboxMobile);