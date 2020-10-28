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
        }
        .header {
          border-bottom: 1px solid lightgray
        }
        .cardWrapper {
          display: flex;
          justify-content: end;
          padding: 50px;
          flex: 1;
        }
      </style>
      <tacklebox-toolbar user="{{user}}"></tacklebox-toolbar>
      <login-element hidden\$="[[hasUser(user.*)]]" user="{{user}}"></login-element>
      <template is="dom-if" if="{{user}}">
        <div id="content" style="flex: 1">
          <div class="cardWrapper">
            <template is="dom-repeat" items="{{fishingSessions}}" filter="{{filterFishingSessions(item)}}">
              <div class="card">
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
      <template>
    `;
  }

  static get is() { return 'dashboard-page'; }
  static get properties() {
    return {
      user: {
        type: Object,
        notify: true,
      },
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
      this.set('fishingSessions', k.toArray(fishingSessions))
    }
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
}
customElements.define(DashboardPage.is, DashboardPage);
