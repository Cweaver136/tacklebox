import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

class LoginElement extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          flex-direction: column;
          align-items: center;
          display: flex;
          font-family: var(--paper-font-title_-_font-family)
        }
       #content {
          display: flex;
          flex-direction: column;
          margin: 10px;      
          border-radius: 10px;
          border: 1px solid lightgray;
          flex: 1;
          align-items: center;
          justify-content: center;
       }
       #title {
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
       .buttonConfirm {
         background-color: #ffa012;
         border-radius: 50px;
         width: 100px;
         margin: 20px;
       }
       .buttonCancel {
          background-color: lightgray;
          border-radius: 50px;
          width: 100px;
          margin: 20px;
       }
       .flex-row {
         display: flex;
       }
      </style>
      <h1 id="title">Tacklebox Fishing</h1>
      <h3>{{actionButtonText}}</h3>
      <div id="loginForm">
        <paper-input class="input" value="{{formEmail}}" placeholder="email"></paper-input>
        <paper-input class="input" type="password" value="{{formPassword}}" placeholder="password"></paper-input>                    
        <div class="flex-row">          
          <paper-button hidden\$="[[equal(actionButtonText, 'Login')]]" class="buttonCancel" on-tap="switchActionButton">Cancel</paper-button>
          <paper-button class="buttonConfirm" on-tap="submitAction">{{actionButtonText}}</paper-button>
        </div>
        <span hidden\$="[[equal(actionButtonText, 'Register')]]" style="text-decoration: underline; cursor: pointer" on-click="switchActionButton">Register Account</span>
      </div>
    `;
  }

  static get is() { return 'login-element'; }
  static get properties() {
    return {
      password: {
        type: String,
      },
      email: {
        type: String,
      },
      user: {
        type: Object,
        notify: true,
      },
      actionButtonText: {
        type: String,
        value: 'Login'
      }
    };
  }
  static get observers() {
    return [
    ]
  }
  ready() {
    super.ready();

    firebase.auth().onAuthStateChanged(user => {
      if (user) this.set('user', user);
    })
  }
  equal(a, b) {
    return a == b;
  }
  switchActionButton() {
    if (this.actionButtonText == 'Login') this.set('actionButtonText', 'Register');
    else if (this.actionButtonText == 'Register') this.set('actionButtonText', 'Login');
  }
  submitAction() {
    if (this.actionButtonText == 'Login') {
      if (this.formPassword != '' && this.formEmail != '') {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            return firebase.auth().signInWithEmailAndPassword(this.formEmail, this.formPassword)
          })
          .catch(function(err) {
            console.log(err)
          });
      }
    }
    else if (this.actionButtonText == 'Register') {
      let emailReg = /^[^@]+@[^@]+\.[^@]+$/;
      if (this.formPassword.length > 6 && this.formEmail!= '' && emailReg.test(this.formEmail)) {
        firebase.auth().createUserWithEmailAndPassword(this.formEmail, this.formPassword).then(snapshot => {
          firebase.database().ref('users/' + snapshot.user.uid).set({email : this.formEmail})
          this.set('actionButtonText', 'Login');
        }).catch(error => {
          console.log(error)
        })
      }
    }    
  }
}
customElements.define(LoginElement.is, LoginElement);