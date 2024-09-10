import Axios from 'axios'
import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux';
import { fetchUserDataById } from '../../redux/actions';

//styles
import AntDesign from 'react-native-vector-icons/AntDesign'
import Profile from '../../../assets/images/dp.jpg'
import { BASE_URL, FONTS, hp, WIDTH, wp } from '../../helper/constants'
import Promises from '../../helper/Promises'

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

class CallRequest extends Component {

  state = {
    continueLoader: false,
    notificationData: '',
    from: ''
  }

  componentDidMount() {
    global.page = 'callRequest'
    const { callData, from } = this.props.route.params
    this.setState({ notificationData: callData, from })
    console.log(from, 'FROMM!!!!!!!');
    if (from) {
      this.props.fetchUserDataById();
    }
  }

  render() {
    return this.renderMainView()
  }

  /*
  .##........#######...######...####..######...######.
  .##.......##.....##.##....##...##..##....##.##....##
  .##.......##.....##.##.........##..##.......##......
  .##.......##.....##.##...####..##..##........######.
  .##.......##.....##.##....##...##..##.............##
  .##.......##.....##.##....##...##..##....##.##....##
  .########..#######...######...####..######...######.
  */

  accepltDeclineAPI = async (status) => {
    const { notificationData } = this.state
    const { roomName, videoCallid } = notificationData

    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    const obj = {
      UserId: userId,
      callOwnerId: notificationData.callOwnerId,
      IsJoinCall: status,
      roomName: roomName,
      fromChat: this.state.from == 'friendcall',
    }
    Axios.post(`${BASE_URL}User/ReceiverAcceptDeclinedVideoCall`, obj, { headers: createHeaders(token) })
      .then(res => {
        this.setState({ continueLoader: false })
        if (!status) {
          this.props.navigation.replace('BottomBar')
        } else {
          if (this.state.from == 'friendcall') {
            this.props.navigation.replace('VideoCall2', {url: videoCallid, room: roomName, userData: notificationData, from: 'callRequest'})
          } else {
            this.props.navigation.replace('VideoCall', {url: videoCallid, room: roomName, userData: notificationData, from: 'callRequest'})
          }
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ continueLoader: false })
      })
  }

  onContinue = () => {
    this.setState({ continueLoader: true }, async () => {
      this.accepltDeclineAPI(true)
    })
  }

  onDecline = () => {
    this.setState({ isCallModalVisible: false }
      , async () => {
      this.accepltDeclineAPI(false)
    }
    )
    this.props.navigation.navigate('BottomBar')
  }

  /*
  ..######...#######..##.....##.########...#######..##....##.########.##....##.########
  .##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##...
  .##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##...
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##...
  .##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##...
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##...
  ..######...#######..##.....##.##.........#######..##....##.########.##....##....##...
  */

  renderMainView = () => {
    const { notificationData } = this.state
    const { firstname, lastname, age,  profileImage} = notificationData

    return (
      <View style={styles.container}>
        <View style={styles.finalModal}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.innerContainer}>
              <LinearGradient style={styles.profileView} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
               {profileImage ? <Image source={{ uri: profileImage }} style={styles.profile} /> : <Image source={Profile} style={styles.profile} />}
              </LinearGradient>
              <Text style={[styles.modalText, { fontSize: wp('6%'), fontFamily: FONTS._BOLD }]}>{`${firstname} ${lastname}`}</Text>
              <Text style={[styles.modalText, {
                marginTop: 0,
                color: 'darkgray',
                fontSize: wp('4%'),
                marginBottom: 10
              }]}>{`Age : ${age} years`}</Text>
              <Text style={[styles.modalText, { marginTop: 0 }]}>{`${firstname} is calling you on SEEMEE`}</Text>
              <Text style={[styles.modalText, { marginTop: wp('5%') }]}>Do you want to continue with Video Call?</Text>
              <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.onContinue}>
                  <LinearGradient style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AntDesign name="check" size={22} />
                      <Text style={styles.seemeeText}>Continue</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.divider}>
                  <View style={styles.border} />
                  <View style={styles.orView}>
                    <Text style={styles.orText}>OR</Text>
                  </View>
                  <View style={styles.border} />
                </View>
                <TouchableOpacity onPress={this.onDecline}>
                  <View style={[styles.btn, { backgroundColor: '#E7E7E7' }]}>
                    <AntDesign name="close" size={22} />
                    <Text style={styles.seemeeText}>Decline</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  finalModal: {
    flex: 1,
    alignSelf: 'center',
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: hp('4%')
  },
  orView: {
    padding: 9,
    borderRadius: 50,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    marginHorizontal: wp('3%')
  },
  orText: {
    fontFamily: FONTS.BOOK,
    fontSize: 11,
  },
  border: {
    width: '30%',
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1
  },
  innerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('10%'),
    borderRadius: wp('5%'),
    width: WIDTH * 0.80,
  },
  modalText: {
    fontSize: wp('5%'),
    fontFamily: FONTS.BOOK,
    textAlign: 'center',
    marginTop: wp('16%'),
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 10
  },
  profileView: {
    height: wp('35%'),
    width: wp('35%'),
    padding: wp('1%'),
    borderRadius: 100,
    position: 'absolute',
    alignSelf: 'center',
    top: -wp('12.5%')
  },
  profile: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 100
  },
  seemeeText: {
    fontFamily: FONTS.BOOK,
    marginLeft: 5,
    fontSize: wp('5%'),
  },
  waitingText: {
    textAlign: 'center',
    fontFamily: FONTS.BOOK,
    marginTop: 7
  }
})

const mapStateToProps = (state) => {
  return {
    user: state.users.userData
  }
};

export default connect(mapStateToProps, { fetchUserDataById })(CallRequest);
