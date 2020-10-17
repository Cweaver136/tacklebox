import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../login-element/login-element.js'

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

class AdminPage extends PolymerElement {
  static get template() {
    return html`
      <style>
      </style>
      <div id="content" style="justify-content: end">
        <div style="display: flex">
            <paper-input label="Point one" value="{{firstPoint}}" style="margin: 10px"></paper-input>
            <paper-input label="Point two" value="{{secondPoint}}" style="margin: 10px"></paper-input>
        </div>
        <div>
            <img src="../_elements/admin-page/test.jpg" style="width: 100%" on-click="getExifData">
        </div>    
      </div>
    `;
  }

  static get is() { return 'admin-page'; }
  static get properties() {
    return {
      pointToSet: {
          type: String,
          value: 'first'
      },      
    };
  }
  static get observers() {
    return [
    ]
  }
  ready() {
    super.ready();

    this.addEventListener('click', () => {
        if (this.pointToSet == 'first') {
            this.pointToSet = 'second';
            this.set('firstPoint', 'text1')
        }
        else {
            this.pointToSet = 'first';
            this.set('secondPoint', 'text2')
        }
    })
    }
    getExifData() {
        console.log("test")
        EXIF.getData(this, function() {

            myData = this;
    
            console.log(myData.exifdata);
        });
    }
}
customElements.define(AdminPage.is, AdminPage);