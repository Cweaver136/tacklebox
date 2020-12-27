import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../tacklebox-toolbar/tacklebox-toolbar'
import '../login-element/login-element'
import '../../helpers/style-modules/flex-styles'
import '../../helpers/widgets/toArray'
import moment from 'moment'

class DashboardPage extends PolymerElement {
  static get template() {
    return html`
      <style include="flex-styles">
        :host {
          position: relative;
          overflow-x: hidden;
          font-family: 'Roboto';
          flex: 1;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
        [hidden] {
          display: none;
        }
        #content {
          display: flex;
          justify-content: center;
          align-self: center;
          flex: 1;
          width: 100%;
        }
        .card {
          border: 1px solid lightgray;
          border-radius: 10px;
          margin: 15px;
          height: 250px;
          width: 250px;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          transition: all 0.1s;
        }
        .card:hover {
          cursor: pointer;
          transform: scale(1.04);
          box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
        }
        .header {
          border-bottom: 1px solid lightgray
        }
        .contentWrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          padding: 50px;
          flex: 1;
        }
        #detailsPage {
          display: flex;
          background-color: white;
          width: 100%;
          position: absolute;
          height: calc(100% - 60px);
          right: -100%;
          bottom: 0;
          transition: .3s all
        }
        #detailsPage[opened] {
          right: 0;
        }
        #detailsWrapper {
          display: flex;
          width: 100%;
        }
        #infoColumn {
          border-right: 1px solid lightgray;
          flex: .4;
          padding: 50px;
        }
        #fishColumn {
          flex: .6;
        }
        #getTripDataButton {
          border-radius: 50px;
          background: #233d4d;
          margin: 20px;
          color: #fcca46;
        }
      </style>
      <tacklebox-toolbar user="{{user}}"></tacklebox-toolbar>
      <login-element hidden\$="[[hasUser(user.*)]]" user="{{user}}"></login-element>
      <template is="dom-if" if="{{user}}">
        <paper-toast id="toast" text="{{toastText}}" visible="false" duration="{{toastDuration}}">
          <span id="toastBody"></span>
          <template is="dom-if" if="{{showCloseToastButton}}">
            <paper-button style="margin:5px; padding:5px;" on-tap="closeToast">Close</paper-button>
          </template>
        </paper-toast>
        <div id="content" style="flex: 1">
          <div class="contentWrapper">
            <template is="dom-repeat" items="{{toArray(fishingSessions)}}" filter="{{filterFishingSessions(item)}}">
              <div class="card" key\$="{{item.$key}}" on-tap="openSessionData">
                <div class="header">
                  <h3 style="margin-left: 5px;">{{item.body_of_water}}</h3>
                  <h5 style="margin-left: 5px;">{{getDate(item)}}</h5>
                </div>
                <div class="imageWrapper">
                </div>
              </div>
            </template>
          </div>
        </div>
        <div id="detailsPage" opened\$="{{detailsOpen}}">
            <div id="detailsWrapper">
              <div id="infoColumn">
                <div class="flex-align-center">
                  <h3 style="margin-left: 5px;">{{selectedTrip.body_of_water}}</h3>
                  <paper-icon-button icon="icons:build" on-tap="getTripData" id="getTripDataButton"></paper-icon-button>
                </div>
                <h5 style="margin-left: 5px;">{{getDate(selectedTrip)}}</h5>
                <span>Temperature</span>
                <span>H: 72 | L: 70</span>
              </div>
              <div id="fishColumn">
              <template is="dom-repeat" items="">
                <div class="fishEntry">
                
                </div>
              </template>
              </div>
            </div>
          </div>
      <template>'
    `;
  }

  static get is() { return 'dashboard-page'; }
  static get properties() {
    return {
      user: {
        type: Object,
        notify: true,
      },
      detailsOpen: {
        type: Boolean,
        value: false,
      }
    };
  }
  static get observers() {
    return [
      'getData(user)',
    ]
  }
  async getData() {
    if (this.user) {
      let fishingSessions = await firebase.database().ref('sessions').once('value').then(s => s.val());
      this.set('fishingSessions', fishingSessions)
    }
  }
  toArray(obj) {
    return k.toArray(obj);
  }
  getDate(item) {
    return moment(item.date).format('MMM Do YYYY')
  }
  hasUser() {
    if (this.user) return true;
    else return false;
  }
  filterFishingSessions() {
    return function(item) {
      return item.uid == this.user.uid;
    };
  }
  toast(text, innerHTML, duration) {
    this.shadowRoot.querySelector('#toast').hide();
    this.toastText = text;
    if (innerHTML != null) {
      this.shadowRoot.querySelector('#toastBody').innerHTML = innerHTML;
    } else {
      this.set('$.toastBody.innerHTML', '');
    }
    if (duration != null) this.set('toastDuration', duration);
    else this.set('toastDuration', 6000);
    this.shadowRoot.querySelector('#toast').show();
  }
  findParentElementByClass(startingNode, desiredClass) {
    if (startingNode.classList.contains(desiredClass)) return startingNode;
    else return this.findParentElementByClass(startingNode.parentElement, desiredClass);
  }
  openSessionData(e) {
    let target = this.findParentElementByClass(e.target, 'card');
    let key = target.getAttribute('key');
    this.detailsOpen = true;
    this.set('selectedTrip', this.fishingSessions[key]);
    console.log("key", key)
  }
  getTripData() {
    this.toast('Getting Trip Data');
    console.log(this.selectedTrip);
  }
}
customElements.define(DashboardPage.is, DashboardPage);
