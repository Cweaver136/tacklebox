import { PolymerElement, html } from "../../../node_modules/@polymer/polymer/polymer-element.js";
import "../../../node_modules/@polymer/paper-button/paper-button.js";
import "../../../node_modules/@polymer/paper-input/paper-input.js";

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
       #submitButton {
         background-color: #ffa012;
         border-radius: 50px;
         width: 100px;
         margin: 20px;
       }
      </style>
      <div id="pageContent">
        <h1 id="title">Tacklebox Fishing</h1>
        <div id="loginForm">
          <paper-input class="input" value="{{formEmail}}" placeholder="email"></paper-input>
          <paper-input class="input" value="{{formPassword}}" placeholder="password"></paper-input>
          <paper-button id="submitButton">Login</paper-button>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'tacklebox-mobile';
  }

  static get properties() {
    return {};
  }

  static get observers() {
    return [];
  }

  ready() {
    super.ready();
  }

}

customElements.define(TackeleboxMobile.is, TackeleboxMobile);