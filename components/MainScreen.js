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
      view: "start"
    };
    console.ignoredYellowBox = [
      'Setting a timer'
    ];


  }

  componentDidMount() {
  }

  render() {

    const start = () => {
      return (
        <View style={styles.startView}>
          <AwesomeButton
            height={wp('50%')}
            width={wp('50%')}
            alignItems={'center'}
            backgroundColor={'#ffa012'}
            backgroundDarker={'#ff9e1f'}
            borderRadius={100}
            onPress={() => {
              this.setState({ view: 'fishing' })
            }}>
            Let's Fish!
            </AwesomeButton>
        </View>
      )
    }

    const fishing = () => {
      return (
        <View></View>
      )
    }

    const pause = () => {
      return (
        <View></View>
      )
    }

    return (
      <View>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.header}>T A C K L E B O X</Text>
          </View>
          <View style={styles.dataContainer}>
            {this.state.view === 'start' ? start() : null}
          </View>
          <View style={styles.buttonNav}>
              {/* This section features all the buttons for cycling through tabs. */}

              {/* Inventory Button */}
              <TouchableOpacity style={styles.navOption}>
                <Text style={styles.navOptionText}>
                  Today
                </Text>
              </TouchableOpacity>

              {/* Log Button */}
              <TouchableOpacity style={styles.navOption}>
                <Text style={styles.navOptionText}>
                  Lures
                </Text>
              </TouchableOpacity>

              {/* Sort button */}
              <TouchableOpacity style={styles.navOption}>
                <Text style={styles.navOptionText}>
                  History
                </Text>
              </TouchableOpacity>

              {/* Give Currency button */}
              <TouchableOpacity style={styles.navOption}>
                <Text style={styles.navOptionText}>
                  Logout
                </Text>
              </TouchableOpacity>

              {/* End of button tab container. */}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  //  HEADER

  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: hp('12%'),
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },

  header: {
    color: '#15b9ff',
    fontSize: 28,
    fontWeight: '500',
    paddingVertical: hp('2%')
  },

  // MAIN CONTAINER

  dataContainer: {
    width: '100%',
    paddingVertical: hp('2%'),
    paddingHorizontal: hp('2%'),
    height: hp('78%'),
    alignItems: 'center'
  },

  startView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },


  // FOOTER NAV

  buttonNav: {
    width: '100%',
    height: hp('11%'),
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopColor: 'grey',
    borderTopWidth: 2,
  },

  navOption: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "grey",
    width: wp('25%'),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  navOptionText: {
    fontWeight: "600",
    fontSize: 16,
  },

})


export default MainScreen;