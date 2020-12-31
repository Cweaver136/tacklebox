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
        #photoContainer, #audioContainer {
          border: 1px solid lightgray;
          border-radius: 15px;
          min-height: 150px;
          width: 100%;
          padding: 10px;
          flex-wrap: wrap;
        }
        #photosWrapper, #audioClipsWrapper {
          margin: 0px 30px;
        }
        #uploadContainers {
          width: 100%;
          margin-bottom: 200px;
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
        .trashcanDelete {
          position: absolute;
          right: 0;
        }
        .audioClipDetails {
          position: relative;
          margin: 2px 0px;
          padding: 0px 5px;
          height: 30px; 
          width: 95%;
          border-radius: 15px;
          border: 1px solid lightgray;
        }
        .audioClipDetails > span {
          font-size: 14px;
        }
        #buttonBar {
          padding: 10px 0px;
          margin-top: 20px;
          border-top: 1px solid lightgray;
          width: 100%;
          position: fixed;
          bottom: 0;
          background: white;
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
            <paper-dropdown-menu label="Trips" style="width:325px" vertical-offset="55" style="margin: 10px 0px;">
              <paper-listbox style="width:325px" slot="dropdown-content" selected="{{selectedSessionIndex}}">
                <template is="dom-repeat" items="{{fishingSessions}}" filter="{{filterFishingSessions(item)}}">
                  <paper-item>{{computeSessionTitle(item)}}</paper-item>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-button disabled="{{!canContinue}}" class="button" page="1" on-tap="changePage">Continue</paper-button>
          </div>
          <div hidden\$="{{!equal(pageIndex, 1)}}" index="1" class="pageView flex-col-center-h">
            <h2>{{computeSessionTitle(selectedSession)}}</h2>
            <div class="flex-row-baseline" id="uploadContainers">
              <div class="flex-col-center-vh" id="photosWrapper" style="width: 40%">
                <paper-button class="button uploadButton" on-tap="selectPhotos">Select Photos</paper-button>
                <input style="display: none" type="file" id="photos" multiple />
                <div class="flex-row-center" id="photoContainer">
                  <template is="dom-repeat" items="{{toArray(photosToUpload)}}" as="picture">
                    <div style="height: 135px; position: relative; margin: 5px">
                      <img src="{{picture.src}}" class="thumbnailPhoto">
                      <paper-icon-button icon="icons:delete" key\$="{{picture.$key}}" data="photosToUpload" on-tap="deleteItem" class="trashcanDelete"></paper-icon-button>
                    </div>
                  </template>
                </div>
              </div>
              
              <div class="flex-col-center-vh" id="audioClipsWrapper" style="width: 40%">
                <paper-button class="button uploadButton" on-tap="selectAudioClips">Select Audio Clips</paper-button>
                <input style="display: none" type="file" id="audioClips" multiple />
                <div class="flex-col-center-h" id="audioContainer">
                  <template is="dom-repeat" items="{{toArray(audioToUpload)}}" as="clip">
                    <div class="audioClipDetails flex-align-center">
                      <span>{{clip.name}}</span>
                      <paper-icon-button icon="icons:delete" key\$="{{clip.$key}}" data="audioToUpload" on-tap="deleteItem" class="trashcanDelete"></paper-icon-button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            
            <div id="buttonBar" class="flex-row-center" style="">
              <paper-button style="background-color: #272932" page="0" on-tap="changePage" class="button">Back</paper-button>
              <paper-button on-tap="uploadData" class="button">Upload Data</paper-button>
            </div>
          </div>
          <div hidden\$="{{!equal(pageIndex, 2)}}" index="2" class="pageView flex-col-center-h">
            <div class="flex-col-center-vh">
              <h3>Upload Details:</h3>
              <template is="dom-if" if="{{numPhotosUploaded}}">
                <span>{{numPhotosUploaded}} Photos have successfully been uploaded to {{computeSessionTitle(selectedSession)}}</span>
              </template>
              <template is="dom-if" if="{{numAudioClipsUploaded}}">
                <span>{{numAudioClipsUploaded}} Audio Clips have successfully been uploaded to {{computeSessionTitle(selectedSession)}}</span>
              </template>
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
        type: Object,
        value: {},
      },
      audioToUpload: {
        type: Object,
        value: {}
      },
      photoListener: {
        type: Boolean,
        value: false,
      },
      audioListener: {
        type: Boolean,
        value: false
      },
      numPhotosUploaded: {
        type: Number,
        value: 0
      },
      numAudioClipsUploaded: {
        type: Number,
        value: 0
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
    if (!this.photoListener) {
      this.photoListener = true;
      this.shadowRoot.querySelector('#photos').addEventListener('change', e => {
        var files = e.target.files;
        let count = files.length;
        let obj = {};
        this.toast(`Loading Photos...`, null, 100000000);
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0; i < count; i++) {
          let file = files[i];
          console.log("file", file)
          // Only process image files.
          if (file.type.match('image.*')) {
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (event) => {
                // Render thumbnail.
                file.src = event.target.result
                // Add file to photosToUpload array
                EXIF.getData(file, function() {
                  EXIF.getAllTags(this)
                  console.log("metadata", this);
                })
                obj[file.name] = file;
                if (!--count) this.photosLoaded(obj);
            };
            // Read in the image file as a data URL.
            reader.readAsDataURL(file);
          }
        }
      }, false);
    }
    this.shadowRoot.querySelector('#photos').click();
  }
  selectAudioClips() {
    if (!this.audioListener) {
      this.audioListener = true;
      this.shadowRoot.querySelector('#audioClips').addEventListener('change', e => {
        var files = e.target.files;
        let count = files.length;
        let obj = {};
        this.toast(`Loading Audio Clips...`, null, 3000);
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0; i < count; i++) {
          let file = files[i];
          obj[file.name] = file;
        }
        this.set('audioToUpload', obj);
      }, false);
    }
    this.shadowRoot.querySelector('#audioClips').click();
  }
  async uploadData() {
    let update = {};
    this.progressPercent = 0;
    let counter = 0;
    let photosLength = Object.keys(this.photosToUpload).length;
    let audioLength = Object.keys(this.audioToUpload).length;
    let filesLength = photosLength + audioLength;
    if (audioLength > 0) {
      await new Promise(async (resolve) => {
        let audioCounter = 0;
        this.progressText = `Uploading Audio Clip ${audioCounter + 1} of ${audioLength}`;
        for (let key in this.audioToUpload) {
          let clip = this.audioToUpload[key];
          console.log(clip);
          let clipId = uuidv4();
          await new Promise(resolve => {
            let audioRef = firebase.storage().ref(`audio/${this.selectedSession.$key}/${clipId}`)
            audioRef.put(clip).then(() => {
              audioRef.getDownloadURL().then(url => {
                update[this.selectedSession.$key + '/audio/'+ clipId] = {url};
                this.progressPercent = (++counter / filesLength) * 100;
                this.progressText = `Uploading Audio Clip ${++audioCounter} of ${audioLength}`;
                this.numAudioClipsUploaded++;
                resolve();
              })
            });
          })
        }
        resolve();
      })
    }
    
    if (filesLength > 0) {
      await new Promise(async (resolve) => {
        let photoCounter = 0;
        this.shadowRoot.querySelector('#progressToast').open();
        this.shadowRoot.querySelector('#progressPercent').indeterminate = true;
        if (photosLength > 0) {
          this.progressText = `Uploading Photo ${photoCounter + 1} of ${photosLength}`;
          for (let key in this.photosToUpload) {
            let photo = this.photosToUpload[key];

            // build exif data
            let dateTime = photo.exifdata.DateTime;
            let date = dateTime.split(' ')[0].replace(':', '-');
            let time = dateTime.split(' ')[1];
            let dateTaken = moment(`${date} ${time}`).valueOf();
            
            let photoId = uuidv4();
            await new Promise(resolve => {
              let pictureRef = firebase.storage().ref(`photos/${this.selectedSession.$key}/${photoId}`)
              pictureRef.put(photo).then(() => {
                pictureRef.getDownloadURL().then(url => {
                  update[this.selectedSession.$key + '/photos/'+ photoId] = {
                    url,
                    date_taken: dateTaken,
                  };
                  this.progressPercent = (++counter / filesLength) * 100;
                  this.progressText = `Uploading Photo ${++photoCounter} of ${photosLength}`;
                  this.numPhotosUploaded++;
                  resolve();
                })
              });
            })
          }
          resolve();
        }
      })
      
      if (Object.keys(update).length > 0) {
        console.log("update", update)
        firebase.database().ref('sessions').update(update).then(() => {
          this.progressText = "Photos Uploaded Complete";
          this.shadowRoot.querySelector('#progressPercent').indeterminate = false;
          this.progressPercent = 100;
          this.pageIndex = 2;
          this.photosToUpload = {};
          setTimeout(() => this.shadowRoot.querySelector('#progressToast').close(), 5000);
        })
      }
    }
    else {
      this.toast('No photos selected to upload')
    }
  }
  photosLoaded(files) {
    if (Object.keys(files).length > 0) {
      let photos = JSON.parse(JSON.stringify(this.photosToUpload));
      // if this photo isn't in the existing photo list, add it
      for (let key in files) {
        if (!photos[key]) {
          photos[key] = files[key];
        }
        else {
          console.log("photo already exsists", key)
        }
      }
      this.set('photosToUpload', files);
      this.toast(`Loading Photos...`, null, 2000);
    }
  } 
  deleteItem(e) {
    let key = e.target.getAttribute('key');
    let data = e.target.getAttribute('data');
    console.log(key, data);
    console.log(JSON.parse(JSON.stringify(this[data])))
    // let temp = JSON.parse(JSON.stringify(this[data]));
    // delete temp[key];
    // console.log(temp, data, key)
    // this.set(data, temp)
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
