import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Text, Keyboard } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button'
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux'

class Registration extends Component {

  constructor(props) {

    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPass: '',
      name: '',
      error: '',
      loading: false,
      text: 'REGISTER',

    };
    console.ignoredYellowBox = [
      'Setting a timer'
    ];

    this.register = this.register.bind(this)

  }

  register() {
    Keyboard.dismiss();
    const { email, password, name, confirmPass } = this.state;
    let nameReg = /^[a-zA-Z]+ [a-zA-Z]+$/;
    let emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name == '' || email == '' || password == '' || confirmPass == '') this.setState({ error: "Please fill out all the fields." });

    // regex to check for first and last name
    else if (!nameReg.test(name)) {
      this.setState({ error: "Check the formatting of your name, and enter your full name." });
    }
    // password needs to be over 6 characters
    else if (password.length < 6) {
      this.setState({ error: "Please enter a password that's more than 6 characters." });
    }
    else if (password != confirmPass) {
      this.setState({ error: "Make sure your passwords match." });
    }
    // validate email
    else if (!email.includes('@') || !emailReg.test(email)) {
      this.setState({ error: "Please enter a valid email." })
    }
    else {
      this.setState({ error: '', loading: true, text: 'REGISTERING' });
      var nameArray = name.trim().split(' ');
      if (nameArray[0]) var first_name = nameArray[0];
      if (nameArray[1]) var last_name = nameArray[1];
      firebase.auth().createUserWithEmailAndPassword(email, password).then(snapshot => {
        firebase.database().ref('users/' + snapshot.user.uid).set({
          email: email,
          first_name: first_name,
          last_name: last_name
        }).then(() => {
          this.setState({ error: '', loading: false, text: 'REGISTER' });
          Actions.login()
        })
      }).catch(error => {
        console.log(error)
        if (error.code == 'auth/email-already-in-use') this.setState({ error: 'Email already in use.', loading: false, text: 'REGISTER' })
        else this.setState({ error: 'Regsitration Failed', loading: false, text: 'REGISTER' })
      })
    }
  }

  render() {
    return (
      <View style={styles.overlayContainer}>
        <KeyboardAvoidingView behavior='position'>
          <View style={styles.logoContainer}>
            <View style={styles.border}>
              <Text style={styles.header}>R E G I S T E R</Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <TextInput placeholder="Full Name" placeholderTextColor='#000000' onChangeText={(name) => this.setState({ name: name })}
              style={styles.input} />
            <TextInput placeholder="Email" placeholderTextColor='#000000' onChangeText={(email) => this.setState({ email: email })}
              style={styles.input} />
            <TextInput placeholder="Password" placeholderTextColor='#000000' secureTextEntry onChangeText={(password) => this.setState({ password: password })}
              style={styles.input} />
            <TextInput placeholder="Confirm Password" placeholderTextColor='#000000' secureTextEntry onChangeText={(confirmPass) => this.setState({ confirmPass: confirmPass })}
              style={styles.input} />
            <Text style={styles.error}>{this.state.error}</Text>
            <AwesomeButton
              height={hp('6%')}
              width={wp('90%')}
              alignItems={'center'}
              backgroundColor={'#ffa012'}
              backgroundDarker={'#ff9e1f'}
              onPress={this.register}>
              <Text style={styles.buttonText}>{this.state.text}</Text>
            </AwesomeButton>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },

  logoContainer: {
    height: hp('40%'),
    alignItems: 'center',
    justifyContent: 'center'
  },

  formContainer: {
    padding: wp('10%'),
    alignItems: 'center'
  },

  border: {
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },

  header: {
    color: '#15b9ff',
    fontSize: 28,
    fontWeight: '500',
    borderBottomColor: '#15b9ff',
    borderBottomWidth: 2,
    paddingVertical: hp('2%')
  },

  logo: {
    height: hp('30%'),
    width: hp('30%'),
  },

  input: {
    height: wp('12%'),
    width: wp('90%'),
    backgroundColor: '#a3a3a3',
    marginBottom: wp('3%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2%'),
    color: '#000000'
  },

  buttonText: {
    fontSize: 16,
    // fontWeight: '500',
    color: 'white'
  },

  signupTextCont: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: wp('2%'),
    paddingBottom: wp('2%'),
    flexDirection: "column"
  },

  signupText: {
    color: "#000",
    fontSize: 16
  },

  signupButton: {
    color: "#ffa012",
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  error: {
    marginBottom: 10
  }

});

export default Registration;