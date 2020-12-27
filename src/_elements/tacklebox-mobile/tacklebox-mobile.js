import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../login-element/login-element.js'
import '../../helpers/style-modules/flex-styles'
import createTimer from 'unitimer'

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
        #confirmDialog {
          borde-radius: 25px;
        }
      </style>

      <paper-dialog id="confirmDialog" layered="false" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-canceled="cancelPromptAction" opened="{{confirmDialogOpened}}">
        <h2>{{confirmDialogHeading}}</h2>
        <div style="display:table; min-height:138px; width:calc(100% - 48px);">
          <span id="confirmBody" style="display:table-cell; vertical-align:middle;">
            <span id="confirmDialogBody"></span>
            <!--Dialog Templates-->
            <template is="dom-if" if="{{equal(confirmDialogBodyType, '')}}">
            </template>
          </span>
        </div>
        <div class="buttons">
          <paper-button on-tap="cancelPromptAction" style\$="{{confirmDialogDismissiveStyle}}" dialog-dismiss="" outline="">{{confirmDialogDismissiveText}}</paper-button>
          <template is="dom-repeat" items="[[confirmDialogOtherButtons]]">
            <paper-button on-tap="confirmDialogButtonCallback" dialog-confirm="" outline="" disabled\$="[[item.disabled]]" style\$="[[item.style]]">[[item.text]]</paper-button>
          </template>
          <paper-button on-tap="confirmDialogCallback" dialog-confirm="" style\$="{{confirmDialogAffirmativeStyle}}" disabled="{{isConfirmDisabled}}">{{confirmDialogAffirmativeText}}</paper-button>
        </div>
      </paper-dialog>

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
                <h3>Time: {{readableTimeElapsed}}</h3>
                <h3>Fish Caught: {{numFishCaught}}</h3>
              </div>
            </div>
            <div class="contentContainer" hidden\$="[[!equal(selectedView, 'paused')]]" id="paused"></div>
            <div class="contentContainer flex-col-center-v" hidden\$="[[!equal(selectedView, 'end')]]" id="end">
              <h2>Trip Details</h2>
              <div>
                <h4>Time: {{readableTimeElapsed}}</h4>
                <h4>Fish Caught: {{numFishCaught}}</h4>
                <h4>Avg Temperatue: {{temperatureData.avg}}</h4>
              </div>
            </div>
          <div>
          <div id="buttons" hidden\$="[[equal(selectedView, 'start')]]">
            <!-- <paper-button on-tap="changePage" class="button">Pause</paper-button> -->
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
      },
      weatherApiKey: {
        type: String,
        value: '18ec2e0a89f38de836ae9e5f16371798'
      
      },
      temperatureData: {
        type: Object,
        value: {}
      },
      elapsedTime: {
        type: Number
      }
    }
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
  async startFishing() {
    this.switchView('inProgress');
    let key = firebase.database().ref(`users/${this.user.uid}/sessions`).push().key
    let update = {}
    let lat;
    let long;

    var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral' ];
    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    console.log(recognition)
    recognition.onresult = function(event) {
      var color = event.results[0][0].transcript;
      console.log("color", color);
      console.log('Confidence: ' + event.results[0][0].confidence);
    } 

    recognition.start();

    this.timer = createTimer().start();
    this.elapsedTimeInterval = setInterval(() => {
      this.timer.stop();
      this.timer.start()
      this.elapsedTime = Math.round(this.timer.total());
      this.readableTimeElapsed = this.msToTime(this.elapsedTime);
    }, 1000)

    // get location of starting spot
    await new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(function(location) {
        lat = location.coords.latitude,
        long = location.coords.longitude
        resolve();
      });
    })
    
    let temp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${this.weatherApiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      return data.main.temp;
    })
    this.set('temperatureData.start', temp);
    
    // let waterData = await fetch('https://waterservices.usgs.gov/nwis/iv/?sites=01571500&format=json')
    // .then(response => response.json())
    // .then(data => {
    //   return data.value.timeSeries[0]
    // })
    // let flow = (parseInt(waterData.values[0].value[0].value) + parseInt(this.state.flowData)) / 2
    // let location = {
    //   lat: waterData.sourceInfo.geoLocation.geogLocation.latitude,
    //   lng: waterData.sourceInfo.geoLocation.geogLocation.longitude
    // }

    update['users/' + this.user.uid + '/sessions/' + key] = true;
    update['sessions/' + key] = {
      uid: this.user.uid,
      date: new Date().getTime(),
      body_of_water: this.bodiesOfWater[this.selectedBOW],
      temperature_data: {
        start: temp
      },
      location_data: {
        start_location: {
          lat,
          long
        }
      }
    }
    firebase.database().ref().update(update).then(() => {
      this.set('sessionId', key);
    }).catch(e => {
      console.log(e)
    })
  }
  endFishing() {
    this.confirm('End Fishing', `Do you want to end your fishing trip?`, 'End', 'Continue', '', null, async () => {
      let update = {};
      let lat;
      let long;
      clearInterval(this.elapsedTimeInterval);
      this.readableTimeElapsed = this.msToTime(this.elapsedTime);
      update['elapsed_time'] = this.elapsedTime;
      // get location of end spot
      await new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(function(location) {
          lat = location.coords.latitude,
          long = location.coords.longitude
          resolve();
        });
      })

      let temp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${this.weatherApiKey}&units=imperial`)
      .then(response => response.json())
      .then(data => {
        return data.main.temp;
      })
      this.temperatureData.end = temp;
      this.temperatureData.avg = (this.temperatureData.start + this.temperatureData.end) / 2;
      
      // let waterData = await fetch('https://waterservices.usgs.gov/nwis/iv/?sites=01571500&format=json')
      // .then(response => response.json())
      // .then(data => {
      //   return data.value.timeSeries[0]
      // })
      // let flow = (parseInt(waterData.values[0].value[0].value) + parseInt(this.state.flowData)) / 2
      // let location = {
      //   lat: waterData.sourceInfo.geoLocation.geogLocation.latitude,
      //   lng: waterData.sourceInfo.geoLocation.geogLocation.longitude
      // }

      update['location_data/end_location'] = {
        lat,
        long
      }
      update['temperature_data/end'] = temp;
      update['temperature_data/avg'] = this.temperatureData.avg;
      firebase.database().ref(`sessions/${this.sessionId}`).update(update).then(() => {
        this.sessionId = null;
        this.selectedView = 'end'
      })
    });
  }
  msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ' h ' + mins + ' m ' + secs + ' s ';
  }
  switchView(target) {
    this.set('selectedView', target);
  }
  confirm(heading, body, affirmativeText, dismissiveText, affirmativeStyle, confirmDialogBodyType, callback, cancelCallback, otherButtons) {
    if (this.skipConfirm) {
      callback();
    } else {
      this.confirmDialogHeading = heading || '';
      this.$.confirmDialogBody.innerHTML = body || '';
      this.confirmDialogAffirmativeText = affirmativeText || '';
      this.confirmDialogDismissiveText = dismissiveText || '';
      this.confirmDialogAffirmativeStyle = affirmativeStyle || '';
      if (affirmativeStyle != null && affirmativeStyle != '') {
        this.confirmDialogDismissiveStyle = 'color:black';
      }
      else {
        this.confirmDialogDismissiveStyle = '';
      }
      this.confirmDialogCallback = callback || function () {};
      this.confirmDialogCancelCallback = cancelCallback || function () {};
      this.confirmDialogBodyType = confirmDialogBodyType;
      this.confirmDialogOtherButtons = otherButtons;
      this.$.confirmDialog.open();
    }
  }
}
customElements.define(TackeleboxMobile.is, TackeleboxMobile);