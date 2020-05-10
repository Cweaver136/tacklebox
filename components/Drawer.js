import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import { Actions } from "react-native-router-flux";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import * as firebase from 'firebase'


class Drawer extends Component {

  constructor(props) {
        
    super(props);
    this.state = {
        uid: '',
        buttons: [],
        fname: '',
        lname: ''
    
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.nuser}>{this.state.fname + " " + this.state.lname}</Text>
        <Text style={styles.lines}></Text>
        <TouchableOpacity>
          <View style={styles.nav}>
            <Text style={styles.buttonText}>Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.nav}>
            <Text style={styles.buttonText}>Terms</Text>
          </View>
        </TouchableOpacity>
      <View style={styles.logoutcontainer}>
        <AwesomeButton style={styles.button}
         width={widthPercentageToDP('39%')}
        textSize={18}
        alignItems='center'
        backgroundColor={'#06531D'} backgroundDarker={'#06331D'} onPress ={() => 
          firebase.auth().signOut().then(() => {
            Actions.login()
          })
         }
        >LOGOUT</AwesomeButton>
        </View>
      </View>
    );
  }
}

const styles = {
  lines:{
    color: '#d3d3d3',
    textDecorationLine: 'underline'
  }, 

  nuser: {
    color: '#d3d3d3',
    fontSize: 25,
    fontWeight: '500',
    alignItems:'center',
    padding: widthPercentageToDP(3),
  },

  container : {
    padding: 25,
    backgroundColor: "#2b2f2f"
  },

  logoutcontainer:{
    marginTop: heightPercentageToDP(62)
  },

  nav:{
    marginTop: heightPercentageToDP(2),
    alignItems:'center',
    backgroundColor: '#d3d3d3',
    height: heightPercentageToDP(5), 
  },

  buttonText:{
    color: '#06531D',
    fontSize: 18,
    fontWeight: '500',
    paddingTop: heightPercentageToDP(.75)
  },

}

export default Drawer

