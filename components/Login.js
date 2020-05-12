import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Text, Keyboard } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase';

class Login extends Component {

  constructor(props) {

    super(props);
    this.state = {
      email: 'cweaver136@gmail.com',
      password: 'testing',
      error: '',
      loading: false,
      text: 'LOGIN',

    };
    console.ignoredYellowBox = [
      'Setting a timer'
    ];

    this.login = this.login.bind(this)
  }

  login() {

    Keyboard.dismiss();
    this.setState({ error: '', loading: true, text: 'LOGGING IN' });
    const { email, password } = this.state;
    if (this.state.email == '' || this.state.password == '') this.setState({ error: "Please fill out all fields.", loading: false, text: "LOGIN" })
    else {
      firebase.auth().signInWithEmailAndPassword(email, password).then(data => {
        this.setState({ uid: data.user.uid });
        Actions.mainScreen();
      }).catch(err => {
        console.log(err)
        this.setState({ error: 'The Email or Password you have entered is incorrect!', loading: false, text: 'LOGIN' })
      })
    }
  }

  render() {
    return (
      <View style={styles.overlayContainer}>
        <KeyboardAvoidingView behavior='position'>
          <View style={styles.logoContainer}>
            {/* <Image 
            style={styles.logo}
            source={require('../../assets/images/KSACKbag.png')}/> */}
            <View style={styles.border}>
              <Text style={styles.header}>T A C K L E B O X</Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <TextInput placeholder={"Email.."} placeholderTextColor='#000000' onChangeText={(email) => this.setState({ email: email })}
              style={styles.input} />
            <TextInput placeholder={"Password.."} placeholderTextColor='#000000' secureTextEntry onChangeText={(password) => this.setState({ password: password })}
              style={styles.input} />
            <Text style={styles.error}>{this.state.error}</Text>
            <AwesomeButton
              height={hp('6%')}
              width={wp('80%')}
              alignItems={'center'}
              backgroundColor={'#ffa012'}
              backgroundDarker={'#ff9e1f'}
              onPress={this.login}>
              <Text style={styles.buttonText}>{this.state.text}</Text>
            </AwesomeButton>

            <View style={styles.signupTextCont}>
              <Text style={styles.signupText}>Don't have an account yet? </Text>
              <TouchableOpacity onPress={() => {
                Actions.registration()
              }}>
                <Text style={styles.signupButton}>Register Now</Text>
              </TouchableOpacity>
            </View>
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
    height: hp('50%'),
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
    width: wp('70%'),
    backgroundColor: '#a3a3a3',
    marginBottom: wp('5%'),
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
    marginBottom: 10,
    textAlign: 'center'
  }


});

export default Login;