import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Image, KeyboardAvoidingView, Text } from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';

class Login extends Component {

  render () {
    return (
    //   <ImageBackground  source={require('../../assets/images/LoginBackground.jpg')} style={styles.container}>
        <View style={styles.overlayContainer}>
        <KeyboardAvoidingView behavior='position'>
        <View style={styles.logoContainer}>
            {/* <Image 
            style={styles.logo}
            source={require('../../assets/images/KSACKbag.png')}/> */}
            <View style ={styles.border}>
            <Text style={styles.header}>T A C K L E B O X</Text>
            </View>
        </View>
        <View style={styles.formContainer}>
        </View>
        </KeyboardAvoidingView>
      </View>
    //   </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    overlayContainer: {
      flex:1,
      backgroundColor: 'rgba(0, 0, 0, .8)'
    },

    logoContainer: {
      height: hp('55%'),
      alignItems: 'center',
      justifyContent: 'center'
    },

    border:{
      borderBottomColor: '#fff',
      borderBottomWidth: 2,
    },

    header: {
      color: '#fff',
      fontSize: 28,
      fontWeight: '500',
      borderBottomColor: '#fff',
      borderBottomWidth: 2,
      paddingVertical: hp('2%')
    },

    logo: {
      height: hp('30%'),
      width: hp('30%'),
    },
    
});

export default Login;