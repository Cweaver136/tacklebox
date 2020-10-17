import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../tacklebox-toolbar/tacklebox-toolbar'
import '../../helpers/style-modules/flex-styles'
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

class UploadPage extends PolymerElement {
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
          margin-top: 50px;
        }
        .button {
          background-color: #0f7173;
          border-radius: 20px;
          margin: 1em;
          color: white
        }
        .button[disabled] {
          background-color: white;
          border: 1px solid lightgray;
          color: black;
          opacity: .6
        }
        #photoContainer {
          border: 1px solid lightgray;
          border-radius: 15px;
          width: 50%;
          min-height: 150px;
        }
        .pageView {
          width: 100%;
          transition: all 2s;
        }
      </style>
      <tacklebox-toolbar></tacklebox-toolbar>
      <div id="content" style="flex: 1">
        <div hidden\$="{{!equal(pageIndex, 0)}}" index="0" class="pageView flex-col-center-h">
          <h2>Pick your fishing trip</h2>
          <paper-dropdown-menu label="Trips" style="margin: 10px 0px;">
            <paper-listbox>
              <template is="dom-repeat" items="{{}}">
                <paper-item></paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
          <paper-button disabled="{{!canContinue}}" class="button" on-tap="changePage">Continue</paper-button>
        </div>
        <div hidden\$="{{!equal(pageIndex, 1)}}" index="1" class="pageView flex-col-center-h">
          <h2>Selected Fishing Trip Goes here</h2>
          <paper-button class="button uploadButton">Select Photos</paper-button>
          <div id="photoContainer"></div>
          <div class="flex-row-center">
            <paper-button style="background-color: #272932" on-tap="changePage" class="button">Back</paper-button>
            <paper-button disabled="{{!canContinue}}" class="button">Upload Photos</paper-button>
          </div>
        </div>
      </div>
    `;
  }

  static get is() { return 'upload-page'; }
  static get properties() {
    return {
      canContinue: {
        type: Boolean,
        value: true
      },
      pageIndex: {
        type: Number,
        value: 1
      }
    };
  }
  static get observers() {
    return [
    ]
  }
  equal(a, b) {
    return a == b
  }
  ready() {
    super.ready();
  }
  changePage(e) {
    if (this.pageIndex == 1) this.pageIndex = 0;
    else if (this.pageIndex == 0) this.pageIndex = 1;
  }
}
customElements.define(UploadPage.is, UploadPage);
