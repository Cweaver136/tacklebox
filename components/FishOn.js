import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button';
import * as firebase from 'firebase';

export default class FishOn extends Component {

  constructor(props) {

    super(props);
    this.state = {
      type: '',
      length: '',
      lure: '',

    };
    console.ignoredYellowBox = [
      'Setting a timer'
    ];

    this.addFish = this.addFish.bind(this);
  }

  componentDidMount() {
    console.log(this.props)
  }
  addFish() {
    if (this.state.type == '' || this.state.lure == '' || this.state.length == '') {}
    else if (!/^[0-9]*$/.test(this.state.length)) {}

    else {
      firebase.database().ref(`users/${this.props.uid}/sessions/${this.props.sessionKey}/fishCaught`).push({
        type: this.state.type,
        lure: this.state.lure,
        length: this.state.length
      }).then(this.props.confirmFish)
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
            <Text style={styles.label}>Length:</Text>
            <TextInput style={styles.input} placeholder={"Length"} onChangeText={(length) => this.setState({ length: length })}></TextInput>
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
    margin: 5
  },
  smInput: {
    width: '25%',
    margin: 5
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
