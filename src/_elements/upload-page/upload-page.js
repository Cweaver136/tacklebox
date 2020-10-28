import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '../tacklebox-toolbar/tacklebox-toolbar'
import '../login-element/login-element'
import '../../helpers/style-modules/flex-styles'
import '../../helpers/widgets/toArray'
import moment from 'moment'
import { v4 as uuidv4 } from "uuid";

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
          background-color: #fe7f2d;
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
          padding: 10px;
          flex-wrap: wrap;
        }
        .pageView {
          width: 100%;
          transition: all 2s;
        }
        .thumbnailPhoto {
          height: 125px;
          border: 1px solid lightgray;
          margin: 5px;
          border-radius: 10px;
        }
        .thumbnailDelete {
          position: absolute;
          right: 0;
        }
      </style>
      <tacklebox-toolbar user="{{user}}"></tacklebox-toolbar>
      <login-element hidden\$="[[hasUser(user.*)]]" user="{{user}}"></login-element>
      <template is="dom-if" if="{{user}}">
        <div id="content" style="flex: 1">
          <div hidden\$="{{!equal(pageIndex, 0)}}" index="0" class="pageView flex-col-center-h">
            <h2>Pick your fishing trip</h2>
            <paper-dropdown-menu label="Trips" vertical-offset="55" style="margin: 10px 0px;">
              <paper-listbox slot="dropdown-content" selected="{{selectedSessionIndex}}">
                <template is="dom-repeat" items="{{fishingSessions}}" filter="{{filterFishingSessions(item)}}">
                  <paper-item>{{computeSessionTitle(item)}}</paper-item>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-button disabled="{{!canContinue}}" class="button" on-tap="changePage">Continue</paper-button>
          </div>
          <div hidden\$="{{!equal(pageIndex, 1)}}" index="1" class="pageView flex-col-center-h">
            <h2>{{computeSessionTitle(selectedSession)}}</h2>
            <paper-button class="button uploadButton" on-tap="selectPhotos">Select Photos</paper-button>
            <input style="display: none" type="file" id="files" multiple />
            <div class="flex-row-center" id="photoContainer">
            </div>
            <div class="flex-row-center">
              <paper-button style="background-color: #272932" on-tap="changePage" class="button">Back</paper-button>
              <paper-button on-tap="uploadPhotos" class="button">Upload Photos</paper-button>
            </div>
          </div>
        </div>
      <template>
    `;
  }

  static get is() { return 'upload-page'; }
  static get properties() {
    return {
      user: {
        type: Object,
        notify: true,
      },
      canContinue: {
        type: Boolean,
        value: false,
      },
      pageIndex: {
        type: Number,
        value: 0
      },
      fishingSessions: {
        type: Array,
        value: [],
      },
      photosToUpload: {
        type: Array,
        value: [],
      }
    };
  }
  static get observers() {
    return [
      'getData(user)',
      'calcCanContinue(selectedSessionIndex)'
    ]
  }
  selectPhotos() { 
    this.shadowRoot.querySelector('#files').addEventListener('change', e => {
      var files = e.target.files;
      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        // Only process image files.
        if (!file.type.match('image.*')) {
          continue;
        }

        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = event => {
            // Render thumbnail.
            var div = document.createElement('div');
            div.style = `height: 135px; position: relative; margin: 5px;`;
            var img = document.createElement('img');
            img.src = event.target.result;
            img.classList.add('thumbnailPhoto');
            div.appendChild(img);
            div.innerHTML += `<paper-icon-button icon="icons:delete" class="thumbnailDelete" on-tap="deleteThumbnail"></paper-icon-button>`
            this.shadowRoot.querySelector('#photoContainer').insertBefore(div, null);
        };

        // Read in the image file as a data URL.
        reader.readAsDataURL(file);

        // Add file to photosToUpload array
        this.push('photosToUpload', file);
      }
    }, false);
    this.shadowRoot.querySelector('#files').click();
  }
  deleteThumbnail() {
    console.log("deleting")
  }
  ready() {
    super.ready();
  }
  hasUser() {
    if (this.user) return true;
    else return false;
  }
  equal(a, b) {
    return a == b
  }
  toArray(obj) {
    if (obj) {
      return k.toArray(obj)
    }
  }
  changePage(e) {
    if (this.pageIndex == 1) this.pageIndex = 0;
    else if (this.pageIndex == 0) this.pageIndex = 1;
  }
  computeSessionTitle(item) {
    return `${item.body_of_water} - ${moment(item.date).format('M[/]D')}`
  }
  filterFishingSessions() {
    return function(item) {
      return item.uid == this.user.uid;
    };
  }
  calcCanContinue() {
    if (this.selectedSessionIndex != undefined) {
      this.selectedSession = this.fishingSessions[this.selectedSessionIndex]
      this.set('canContinue', true)
    }
    else this.set('canContinue', false)
  }
  async getData() {
    if (this.user) {
      let fishingSessions = await firebase.database().ref('sessions').once('value').then(s => s.val());
      this.set('fishingSessions', k.toArray(fishingSessions))
    }
  }
  async uploadPhotos() {
    if (this.photosToUpload.length > 0) {
      let update = {};
      let promises = [];
      for (let i = 0; i < this.photosToUpload.length; i++) {
        let photoId = uuidv4();;
        promises.push(new Promise(resolve => {
          // todo get photo data and save it to firebase
          let pictureRef = firebase.storage().ref(`photos/${this.selectedSession.$key}/${photoId}`)
          pictureRef.put(this.photosToUpload[i]).then(() => {
            pictureRef.getDownloadURL().then(url => {
              update[this.selectedSession.$key + '/photos/'+ photoId] = {url};
              resolve();
            })
          });
        }))
      }
      Promise.all(promises).then(() => {
        firebase.database().ref('sessions').update(update).then(() => {
          console.log("photos uploaded successfully");
        })
      })
    }
    // else {
    //   this.toast('No photos selected to upload')
    // }
  }
}
customElements.define(UploadPage.is, UploadPage);
