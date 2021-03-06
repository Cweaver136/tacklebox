import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, Alert } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button';
import * as firebase from 'firebase';
import { CheckBox } from 'react-native-elements'
import * as Location from 'expo-location';

export default class FishOn extends Component {

  constructor(props) {

    super(props);
    this.state = {
      type: '',
      length: '',
      lure: '',
      leader: false,
      location: ''

    };
    console.ignoredYellowBox = [
      'Setting a timer'
    ];

    this.addFish = this.addFish.bind(this);
  }

  componentDidMount() {
  }
  async addFish() {
    if (this.state.type == '' || this.state.lure == '' || this.state.length == '') { }
    else if (!/^\d*\.?\d*$/.test(this.state.length)) { }

    else {
      let status = await Location.getPermissionsAsync();
      if (status.status === 'granted') {
        let location = await Location.getCurrentPositionAsync({accuracy: 5});
        let coords = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
        firebase.database().ref(`users/${this.props.uid}/sessions/${this.props.sessionKey}/fishCaught`).push({
          type: this.state.type,
          lure: this.state.lure,
          length: this.state.length,
          leader: this.state.leader ? true : null,
          coords: coords
        }).then(this.props.confirmFish).catch(error => {
          Alert.alert(error)
        })
      }
    }
  }
  render() {
    return (
      <View style={styles.fishOnView}>
        <View style={styles.inputContainer}>
          <View style={styles.medInput}>
            <Text style={styles.label}>Type:</Text>
            <TextInput style={styles.input} placeholder={"Type of fish.."} onChangeText={(type) => this.setState({ type: type })}></TextInput>
          </View>
          <View style={styles.smInput}>
            <Text style={styles.label}>Length:</Text>
            <TextInput style={styles.input} placeholder={"Length"} onChangeText={(length) => this.setState({ length: length })}></TextInput>
          </View>
          <View style={styles.medInput}>
            <Text style={styles.label}>Lure:</Text>
            <TextInput style={styles.input} placeholder={"Lure Used"} onChangeText={(lure) => this.setState({ lure: lure })}></TextInput>
          </View>
          <View style={styles.smInput}>
            <Text style={styles.label}>Leader?</Text>
            <CheckBox
              title=''
              center
              checked={this.state.leader}
              onPress={() => this.setState({ leader: !this.state.leader })}></CheckBox>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <AwesomeButton
            height={wp('15%')}
            width={wp('35%')}
            alignItems={'center'}
            backgroundColor={'#ffa012'}
            backgroundDarker={'#ff9e1f'}
            borderRadius={10}
            textSize={18}
            onPress={this.props.onCancel}>
            Cancel
            </AwesomeButton>
          <AwesomeButton
            height={wp('15%')}
            width={wp('35%')}
            alignItems={'center'}
            backgroundColor={'#ffa012'}
            backgroundDarker={'#ff9e1f'}
            borderRadius={10}
            textSize={18}
            onPress={() => {
              this.addFish()
            }}>
            Add Fish
            </AwesomeButton>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fishOnView: {
    width: '100%',
    height: '100%'
  },

  inputContainer: {
    height: '80%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonContainer: {
    height: '20%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 2
  },

  medInput: {
    width: '50%',
    margin: 10
  },
  smInput: {
    width: '25%',
    margin: 10
  },

  input: {
    height: wp('12%'),
    // backgroundColor: '#a3a3a3',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: wp('5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2%'),
    color: '#000000'
  },
})
