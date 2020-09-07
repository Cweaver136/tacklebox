import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

class LoginElement extends PolymerElement {
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
       .button {
         background-color: #ffa012;
         border-radius: 50px;
         width: 100px;
         margin: 20px;
       }
       .flex-row {
         display: flex;
       }
      </style>
        <h1 id="title">Tacklebox Fishing</h1>
        <h3>Login / Register</h3>
        <div id="loginForm">
          <paper-input class="input" value="{{formEmail}}" placeholder="email"></paper-input>
          <paper-input class="input" value="{{formPassword}}" placeholder="password"></paper-input>
          <div class="flex-row">
            <paper-button class="button" on-tap="submitLogin">Login</paper-button>
            <paper-button class="button" on-tap="submitRegistration">Register</paper-button>
          </div>
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
  submitLogin() {
    if (password != '' && email != '') {
      firebase.auth().signInWithEmailAndPassword(email, password).then(async data => {
        
      }).catch(err => {
        console.log(err)
        this.setState({ error: 'The Email or Password you have entered is incorrect!', loading: false, text: 'LOGIN' })
      })
    }
  }
  submitRegistration() {
    let emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (password.length > 6 && email!= '' && !emailReg.test(email)) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(snapshot => {
        firebase.database().ref('users/' + snapshot.user.uid).set({
          email
        })
      }).catch(error => {
        console.log(error)
        if (error.code == 'auth/email-already-in-use') this.setState({ error: 'Email already in use.', loading: false, text: 'REGISTER' })
        else this.setState({ error: 'Regsitration Failed', loading: false, text: 'REGISTER' })
      })
    }
  }
}
customElements.define(LoginElement.is, LoginElement);