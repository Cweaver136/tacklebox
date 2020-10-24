import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../../helpers/style-modules/flex-styles'
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';

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
            background-color: #233d4d;
            width: 100%;
            margin: 0px;
        }
        .headerColor {
            color: #fcca46;
        }
      </style>
      <div class="flex-row-center" id="navbar">
        <h3 class="headerColor">T A C K L E B O X</h3>
        <template is="dom-if" if="{{user}}">
          <paper-icon-button class="headerColor" icon="icons:input" on-tap="logout"></paper-icon-button>
        </template>
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
    };
  }
  static get observers() {
    return [
    ]
  }
  ready() {
    super.ready();
  }
  logout() {
    if (this.user) {
      firebase.auth().signOut();
    }
  }
}
customElements.define(TackleboxToolbar.is, TackleboxToolbar);