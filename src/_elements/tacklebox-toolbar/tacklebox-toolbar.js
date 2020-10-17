import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../../helpers/style-modules/flex-styles'
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

class TackleboxToolbar extends PolymerElement {
  static get template() {
    return html`
      <style include="flex-styles">
        :host {
          width: 100%;
          display: flex;
          font-family: var(--paper-font-title_-_font-family)
        }
        #navbar {
            background-color: #272932;
            width: 100%;
            margin: 0px;
        }
        .headerColor {
            color: #e7ecef;
        }
      </style>
      <div class="flex-row-center" id="navbar">
        <h3 class="headerColor">T A C K L E B O X</h3>
      </div>
    `;
  }

  static get is() { return 'tacklebox-toolbar'; }
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
}
customElements.define(TackleboxToolbar.is, TackleboxToolbar);