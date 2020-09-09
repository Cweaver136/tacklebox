import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../login-element/login-element.js'

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

class TackeleboxMobile extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          font-family: var(--paper-font-title_-_font-family)
        }
        #pageContent {
        display: flex;
        flex-direction: column;
        padding: 20px;      
        border-radius: 10px;
        border: 1px solid lightgray;
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
        login-element[hidden] {
          
        }
      </style>
      <login-element hidden\$="[[hasUser(user.*)]]" style="flex: 1" user="{{user}}"></login-element>
      <template is="dom-if" if="{{user}}">
        <div></div>
       <span>Hello World!</span>
      </template>
    `;
  }

  static get is() { return 'tacklebox-mobile'; }
  static get properties() {
    return {
      user: {
        type: Object,
        notify: true,
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
  hasUser() {
    console.log(this.user)
    if (this.user) return true;
    else return false;
  }
}
customElements.define(TackeleboxMobile.is, TackeleboxMobile);