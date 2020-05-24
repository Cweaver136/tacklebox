import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Text, Keyboard, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button'
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux'
import prettyMS from 'pretty-ms';

class MainScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      view: "start",
      time: 0,
      fishTotal: 0,
      uid: props.navigation.getParam("uid"),
      sessions: props.navigation.getParam("sessions")
    };

    this.startFishing = this.startFishing.bind(this);
    this.pauseFishing = this.pauseFishing.bind(this);
    this.resumeFishing = this.resumeFishing.bind(this);
    this.fishCaught = this.fishCaught.bind(this);
    this.endFishing = this.endFishing.bind(this);

    console.ignoredYellowBox = [
      'Setting a timer'
    ];
  }


  componentDidMount() {
    let sessions = [];
    Object.entries(this.state.sessions).forEach(([key, value]) => {
      let sessionData = value;
      sessionData.key = key
      sessions.push(sessionData)
    })
    this.setState({sessions: sessions})
  }

  startFishing() {
    let time = this.state.view == 'end' ? 0 : this.state.time
    let start = this.state.view == 'end' ? Date.now() : Date.now() - this.state.time
    let fishTotal = this.state.view == 'end' ? 0 : this.state.fishTotal
    this.setState({
      view: 'fishing',
      time: time,
      start: start,
      fishTotal: fishTotal
    })
    this.timer = setInterval(() => {
      this.setState({
        time: Date.now() - this.state.start
      })
    }, 1000);
  }

  pauseFishing() {
    this.setState({ view: 'pause' });
    clearInterval(this.timer);
  }

  resumeFishing() {
    this.setState({ view: 'fishing' });
    this.startFishing();
  }

  fishCaught() {
    this.setState({ fishTotal: this.state.fishTotal + 1 })
  }

  endFishing() {
    // record fishing session
    this.setState({ view: 'end' })
    console.log(this.state.time)
    console.log(new Date().getTime())
    let sessionData = {
      time: this.state.time,
      date: new Date().now(),
      fishCaught: [],
    }
    firebase.database().ref(`users/${this.state.uid}/sessions`).push(sessionData)
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
            textSize={26}
            onPress={() => {
              this.startFishing();
            }}>
            Let's Fish!
            </AwesomeButton>
        </View>
      )
    }

    const fishing = () => {
      return (
        <View style={styles.fishingView}>
          <View style={styles.fishingInfo}>
            <View style={styles.infoSection}>
              <Text style={styles.textMain}>Fish Totals: {this.state.fishTotal}</Text>
              <Text style={styles.textMain}>Time: {prettyMS(this.state.time, { unitCount: 2, secondsDecimalDigits: 0 })}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.textMain}>Today's Fish</Text>
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
              onPress={() => {
                this.fishCaught()
              }}>
              Fish Caught
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
                this.pauseFishing()
              }}>
              Pause Fishing
            </AwesomeButton>
          </View>
        </View>
      )
    }

    const pause = () => {
      return (
        <View style={styles.fishingView}>
          <View style={styles.fishingInfo}>
            <View style={styles.infoSection}>
              <Text style={styles.textMain}>Fish Totals: {this.state.fishTotal}</Text>
              <Text style={styles.textMain}>Time: {prettyMS(this.state.time, { unitCount: 2, secondsDecimalDigits: 0 })}</Text>
            </View>
            <View style={styles.pausedSection}>
              <Text style={{ fontSize: 26 }}>PAUSED</Text>
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
              onPress={() => {
                this.resumeFishing()
              }}>
              Resume
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
                this.endFishing();
              }}>
              End
            </AwesomeButton>
          </View>
        </View>
      )
    }

    const end = () => {
      return (
        <View style={styles.fishingView}>
          <View style={[styles.fishingInfo, { height: "36%" }]}>
            <View style={[styles.infoSection, { height: "100%" }]}>
              <Text style={styles.textMain}>Fish Totals: {this.state.fishTotal}</Text>
              <Text style={styles.textMain}>Time: {prettyMS(this.state.time, { unitCount: 2, secondsDecimalDigits: 0 })}</Text>
            </View>
          </View>
          <View style={[styles.buttonContainer, { height: "50%" }]}>
            <AwesomeButton
              height={wp('50%')}
              width={wp('50%')}
              alignItems={'center'}
              backgroundColor={'#ffa012'}
              backgroundDarker={'#ff9e1f'}
              borderRadius={100}
              textSize={26}
              onPress={() => {
                this.startFishing();
              }}>
              Let's Fish!
            </AwesomeButton>
          </View>
        </View>
      )
    }

    const history = () => {
      return (
        <View style={styles.historyView}>
          <FlatList
            data={this.state.sessions}
            renderItem={({ item, index }) => (
              <View key={item.key} style={styles.historyEntry}>              
                <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
            )}
          />
        </View>
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
            {this.state.view === 'fishing' ? fishing() : null}
            {this.state.view === 'pause' ? pause() : null}
            {this.state.view === 'end' ? end() : null}
            {this.state.view === 'history' ? history() : null}
          </View>
          <View style={styles.buttonNav}>
            {/* This section features all the buttons for cycling through tabs. */}

            {/* Today Button */}
            <AwesomeButton
              height={hp('6%')}
              width={wp('25%')}
              alignItems={'center'}
              backgroundColor={'#ffa012'}
              backgroundDarker={'#ff9e1f'}
              borderRadius={100}
              textSize={16}
              onPress={() => {
              }}>
              Today
            </AwesomeButton>

            {/* History button */}
            <AwesomeButton
              height={hp('6%')}
              width={wp('25%')}
              alignItems={'center'}
              backgroundColor={'#ffa012'}
              backgroundDarker={'#ff9e1f'}
              borderRadius={100}
              textSize={16}
              onPress={() => { this.setState({ view: 'history' }) }}>
              History
            </AwesomeButton>

            {/* Logout button */}
            <AwesomeButton
              height={hp('6%')}
              width={wp('25%')}
              alignItems={'center'}
              backgroundColor={'#ffa012'}
              backgroundDarker={'#ff9e1f'}
              borderRadius={100}
              textSize={16}
              onPress={() => {
              }}>
              Logout
            </AwesomeButton>

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
    padding: hp('2%'),
    height: hp('78%'),
    alignItems: 'center'
  },

  startView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  fishingView: {
    width: '100%',
    height: '100%',
  },
  fishingInfo: {
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '20%'
  },
  infoSection: {
    height: '45%',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 2,
    padding: hp('2%')
  },
  pausedSection: {
    height: '45%',
    padding: hp('2%'),
    alignItems: 'center',
  },

  // HISTORY PAGE

  historyEntry: {
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 2
  },
  historyDate: {
    fontWeight: "bold"
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

  // NORMALIZE
  textMain: {
    fontSize: 26
  },
})


export default MainScreen;