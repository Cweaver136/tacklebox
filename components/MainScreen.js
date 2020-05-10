import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Text, Keyboard } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button'
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux'

class MainScreen extends Component {

  constructor(props) {

    super(props);
    this.state = {

    };
    console.ignoredYellowBox = [
      'Setting a timer'
    ];


  }


  render() {
    return (
      <View>
        <Text>Hello World!</Text>
      </View>
    );
  }
}


export default MainScreen;