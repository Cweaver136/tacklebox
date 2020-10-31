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
      <paper-toast id="progressToast" style="min-width:315px;" visible="false" duration="0" no-cancel-on-esc-key="">
        <div id="progressText" style="margin-bottom:3px;">{{progressText}}</div>
        <paper-progress id="progressPercent" style="width:auto;" value="{{progressPercent}}"></paper-progress>
      </paper-toast>
      <paper-toast id="toast" text="{{toastText}}" visible="false" duration="{{toastDuration}}">
        <span id="toastBody"></span>
        <template is="dom-if" if="{{showCloseToastButton}}">
          <paper-button style="margin:5px; padding:5px;" on-tap="closeToast">Close</paper-button>
        </template>
      </paper-toast>
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
            <paper-button disabled="{{!canContinue}}" class="button" page="1" on-tap="changePage">Continue</paper-button>
          </div>
          <div hidden\$="{{!equal(pageIndex, 1)}}" index="1" class="pageView flex-col-center-h">
            <h2>{{computeSessionTitle(selectedSession)}}</h2>
            <paper-button class="button uploadButton" on-tap="selectPhotos">Select Photos</paper-button>
            <input style="display: none" type="file" id="files" multiple />
            <div class="flex-row-center" id="photoContainer">
              <template is="dom-repeat" items="{{toArray(photosToUpload)}}" as="picture">
                <div style="height: 135px; position: relative; margin: 5px">
                  <img src="{{picture.src}}" class="thumbnailPhoto">
                  <paper-icon-button icon="icons:delete" key\$="{{picture.$key}}" on-tap="deleteThumbnail" class="thumbnailDelete"></paper-icon-button>
                </div>
              </template>
            </div>
            <div class="flex-row-center">
              <paper-button style="background-color: #272932" page="0" on-tap="changePage" class="button">Back</paper-button>
              <paper-button on-tap="uploadPhotos" class="button">Upload Photos</paper-button>
            </div>
          </div>
          <div hidden\$="{{!equal(pageIndex, 2)}}" index="2" class="pageView flex-col-center-h">
            <div class="flex-col-center-vh">
              <span>{{numPhotosUploaded}} Photos have successfully been uploaded to {{computeSessionTitle(selectedSession)}}</span>
              <paper-button on-tap="changePage" page="0" class="button">Upload More</paper-button>
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
        value: {},
      }
    };
  }
  static get observers() {
    return [
      'getData(user)',
      'calcCanContinue(selectedSessionIndex)'
    ]
  }
  ready() {
    super.ready();
  }
  selectPhotos() { 
    this.shadowRoot.querySelector('#files').addEventListener('change', e => {
      var files = e.target.files;
      let count = files.length;
      let obj = {};
      this.toast(`Loading Photos...`, null, 100000000);
      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0; i < count; i++) {
        let file = files[i];
        // Only process image files.
        if (file.type.match('image.*')) {
          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = (event) => {
              // Render thumbnail.
              file.src = event.target.result
              // Add file to photosToUpload array
              if (!this.photosToUpload[file.name]) obj[file.name] = file
              if (!--count) this.filesLoaded(obj);
          };
          // Read in the image file as a data URL.
          reader.readAsDataURL(file);
        }
      }
    }, false);
    this.shadowRoot.querySelector('#files').click();
  }
  async uploadPhotos() {
    let filesLength = Object.keys(this.photosToUpload).length;
    this.numPhotosUploaded = filesLength;
    if (filesLength > 0) {
      this.shadowRoot.querySelector('#progressToast').open();
      this.shadowRoot.querySelector('#progressPercent').indeterminate = true;
      this.progressPercent = 0;
      let update = {};
      let promises = [];
      let counter = 0;
      this.progressText = `Uploading Photo ${counter + 1} of ${filesLength}`;
      for (let key in this.photosToUpload) {
        let photo = this.photosToUpload[key];
        let photoId = uuidv4();;
        promises.push(new Promise(resolve => {
          let pictureRef = firebase.storage().ref(`photos/${this.selectedSession.$key}/${photoId}`)
          pictureRef.put(photo).then(() => {
            pictureRef.getDownloadURL().then(url => {
              update[this.selectedSession.$key + '/photos/'+ photoId] = {url};
              this.progressPercent = (++counter / filesLength) * 100;
              this.progressText = `Uploading Photo ${counter} of ${filesLength}`;
              resolve();
            })
          });
        }))
      }
      Promise.all(promises).then(() => {
        firebase.database().ref('sessions').update(update).then(() => {
          this.progressText = "Photos Uploaded Complete";
          this.shadowRoot.querySelector('#progressPercent').indeterminate = false;
          this.progressPercent = 100;
          this.pageIndex = 2;
          this.photosToUpload = {};
          setTimeout(() => this.shadowRoot.querySelector('#progressToast').close(), 5000);
        })
      })
    }
    else {
      this.toast('No photos selected to upload')
    }
  }
  filesLoaded(files) {
    this.set('photosToUpload', files);
    this.toast(`Loading Photos...`, null, 2000);
  } 
  deleteThumbnail(e) {
    let key = e.target.getAttribute('key');
    let temp = this.photosToUpload;
    delete temp[key];
    console.log("temp", temp)
    this.set('photosToUpload', temp)
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
    let index = e.target.getAttribute('page');
    this.pageIndex = index
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
}
customElements.define(UploadPage.is, UploadPage);
