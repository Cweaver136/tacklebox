import { PolymerElement } from '../../../node_modules/@polymer/polymer/polymer-element.js';
import { html } from '../../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
class TackleboxDashboard extends PolymerElement {
  static get template() {
    return html`
      <style>
       
      </style>
      <h1>Hello World!</h1>
    `;
  }

  static get is() { return 'tacklebox-dashboard'; }
  static get properties() {
    return {
    };
  }
  static get observers() {
    return [
    ]
  }
  ready() {
    super.ready();
  }
}
window.customElements.define(TackleboxDashboard.is, TackleboxDashboard);