import React, { Component, useCallback } from 'react'
import {
  Text, View, SafeAreaView, Image, TouchableOpacity,
  ActivityIndicator, PermissionsAndroid, Alert, ScrollView, RefreshControl
} from 'react-native'
import { Layout } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import Axios from 'axios';
import GetLocation from 'react-native-get-location'
import Modal from 'react-native-modal';
import messaging from '@react-native-firebase/messaging';
import { connect } from 'react-redux';
import { fetchUserDataById } from '../../redux/actions';

//styles 
import styles from './style'
import { BASE_URL, FONTS, hp, wp } from '../../helper/constants';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Call from '../../../assets/images/call.png'
import OopsImage from '../../../assets/images/oops.jpg'
import Promises from '../../helper/Promises';
import WarningModal from '../../components/Modal';

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

class Matching extends Component {

  state = {
    latitude: '',
    longitude: '',
    isLoading: '',
    nearByUsers: [],
    ringingLoader: false,
    isCallModalVisible: false,
    continueLoader: false,
    matchedUser: '',
    Modaltext: '',
    isModalVisible: false,
    isNoUser: false,
    refreshing: false
  }

  render() {
    return (
      this.renderMainView()
    )
  }

  /*
  .##........#######...######...####..######.
  .##.......##.....##.##....##...##..##....##
  .##.......##.....##.##.........##..##......
  .##.......##.....##.##...####..##..##......
  .##.......##.....##.##....##...##..##......
  .##.......##.....##.##....##...##..##....##
  .########..#######...######...####..######.
  */

  componentDidMount() {
    this.getForegroudNotification()
    this.setState({ isLoading: 'searching' }, () => {
      //  this.getCurrentUserLocation()
      this.getNearbyUsers()
      this._focusedScreen = this.props.navigation.addListener('focus', () => {
        console.log('refreshed  Matching!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        this.getNearbyUsers()
        // this.props.fetchUserDataById()
      })
    })
  }

  componentWillUnmount = () => {
    this.unsubscribe()
  }

  getForegroudNotification = () => {
    this.unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('notification data matching, bar', remoteMessage)
      const data = JSON.parse(remoteMessage.data.data)

      if (remoteMessage.data.type == 'callDeclined') {
        this.setState({ isCallModalVisible: false }, () => {
          setTimeout(() => {
            this.setState({ modalText: 'Your match decline your request', isModalVisible: true })
          }, 700);
        })
      } else if (remoteMessage.data.type == 'callResponse') {
        this.setState({ isCallModalVisible: false })
        setTimeout(() => {
          this.props.navigation.navigate('VideoCall', { url: data.videoCallid, room: data.roomname, userData: data })
        }, 3000);
      } else if (remoteMessage.data.type == 'friendResponse') {
        this.setState({ isCallModalVisible: false })
        setTimeout(() => {
          this.props.navigation.navigate('VideoCall2', { url: data.videoCallid, room: data.roomname, userData: data })
        }, 3000);
      }
    });
  }

  // getCurrentUserLocation = async () => {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     {
  //       title: 'Location Access Required',
  //       message: 'This App needs to Access your location',
  //     },
  //   );
  //   if (granted) {
  //     GetLocation.getCurrentPosition({
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //     })
  //       .then(location => {
  //         this.setState({
  //           latitude: location.latitude,
  //           longitude: location.longitude,
  //         }, () => {
  //           this.saveUserLocation()
  //         });
  //       })
  //       .catch(error => {
  //         const { code, message } = error;
  //         console.warn(code, message);
  //       })
  //   }
  // };

  // saveUserLocation = async () => {
  //   const { latitude, longitude } = this.state
  //   const userId = await Promises.getUsersKey();
  //   const token = await Promises.getUserToken();
  //   const obj = {
  //     LocationId: 0,
  //     UserId: userId,
  //     Latitude: latitude,
  //     Longitude: longitude
  //   }
  //   Axios.post(`${BASE_URL}/UserLocation/SaveLocationDetail`, obj, { headers: createHeaders(token) })
  //     .then((res) => {

  //     })
  //     .catch((err) => {
  //       console.log('err', err)
  //       this.setState({ nearByUsers: [], isLoading: 'false' })
  //     })
  // }

  getNearbyUsers = async () => {
    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    console.log(createHeaders(token));
    Axios.get(`${BASE_URL}User/NearestUsers?userId=${userId}`, {
      headers: createHeaders(token),
    })
      .then((res) => {
        this.setState({refreshing: false})
        if (res.data.status == 200) {
          if (res.data.data.length == 0) {
            setTimeout(() => {
              this.setState({ isLoading: 'false' }, () => {
                setTimeout(() => {
                  this.setState({ isNoUser: true, nearByUsers: [] })
                }, 500);
              })
            }, 500);
          } else {
            console.log('near by users', res.data.data)
            this.setState({ nearByUsers: res.data.data, isLoading: 'false' })
          }
        } else if(res.data.status === 403) {
          Alert.alert('You are suspended')
        }
        
      })
      .catch((e) => {
        this.setState({ isLoading: 'false', refreshing: false })
        Alert.alert('something went wrong')
      });
  }

  getRandomUsers = () => {
    const { nearByUsers } = this.state

    let userImages = []

    nearByUsers.forEach((ele, index) => {
      if (nearByUsers.length > 0) {
        userImages.push(ele.FilePath)
      }
    })

    return userImages
  }

  callRandomUser = async () => {
    if (this.state.nearByUsers.length == 0) {
      this.setState({ isNoUser: true })
    } else {
      this.setState({ ringingLoader: true, continueLoader: false })
      const userId = await Promises.getUsersKey();
      const token = await Promises.getUserToken();

      Axios.get(`${BASE_URL}User/GetUserDetailForCall?userId=${userId}`, {
        headers: createHeaders(token),
      })
        .then((res) => {
          setTimeout(() => {
            if (res.data.data != null) {
              this.setState({ ringingLoader: false, matchedUser: res.data.data, isCallModalVisible: true })
            } else {
              this.setState({
                ringingLoader: false,
                isCallModalVisible: false,
                isModalVisible: true,
                Modaltext: "You reached the end, There's no more matches for you"
              })
            }

          }, 1000);
        })
        .catch((e) => {
          this.setState({ ringingLoader: false })
          console.log(e)
        })
    }
  }

  accepltDeclineAPI = async (status) => {
    const { matchedUser } = this.state

    const userId = await Promises.getUsersKey();
    const token = await Promises.getUserToken();
    const obj = {
      UserId: userId,
      ReceivedUserId: matchedUser.UserId,
      IsJoinCall: status
    }

    Axios.post(`${BASE_URL}User/SenderAcceptDeclinedVideoCall`, obj, { headers: createHeaders(token) })
      .then(res => {
        if (!status) {
          this.getNearbyUsers();
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
  }

  closeModal = () => {
    this.setState({ isModalVisible: false }, () => {
      this.getNearbyUsers();
    })
  }

  onRefresh = () => {
      this.setState({refreshing: true});
      this.getNearbyUsers()
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
    const { isLoading, matchedUser, Modaltext, isModalVisible, refreshing } = this.state

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
            }
            style={styles.container}>
            {this.renderHeader()}
            <Text style={[styles.mainHeaderText, { fontFamily: FONTS.BOOK, marginLeft: 60, zIndex: 999 }]}>Online</Text>
            {
              isLoading === 'searching' ? this.renderLoader() : this.renderCircles()
            }
          </ScrollView>
        </Layout>
        <WarningModal
          Modaltext={Modaltext}
          isModalVisible={isModalVisible}
          closeModal={this.closeModal}
        />
        {this.renderNoUsers()}
        {this.renderFinalModal(matchedUser)}
      </SafeAreaView>
    );
  }

  renderLoader = () => {
    return (
      <Layout style={[styles.container, { marginTop: 40, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#000" />
        <Text style={styles.loaderText}>Please hold on,{'\n'}We are finding your Nearest users</Text>
      </Layout>
    )
  }

  renderNoUsers = () => {
    const { isNoUser } = this.state

    return (
      <Modal isVisible={isNoUser}>
        <View style={{ paddingVertical: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20 }}>
          <Image source={OopsImage} style={styles.img} />
          <Text style={styles.text}>no users found nearby you</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ isNoUser: false })}>
            <LinearGradient
              style={styles.btn}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={['#FBE364', '#87F484']}>
              <Text style={styles.btnText}>i understand</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.headerMain}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.headerBorder} />
          <Text style={styles.mainHeaderText}>Users</Text>
        </View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('BuySkips')}>
          <LinearGradient style={styles.linearLabel} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
            <Text style={styles.txtUpgradetopro}>Purchase Skips,{`\n`}Icebreakers</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }

  renderCircles = () => {
    const { ringingLoader } = this.state
    let Users = this.getRandomUsers()

    return (
      <View style={styles.circleMain}>
        {Users.length >= 4 && <Image source={{ uri: Users[4] }} style={[styles.dp, { height: hp('8%'), width: hp('8%'), top: hp('1%'), left: wp('25%') }]} />}
        {Users.length >= 5 && <Image source={{ uri: Users[5] }} style={[styles.dp, { height: hp('8%'), width: hp('8%'), right: wp('20%'), bottom: 20 }]} />}
        <View style={styles.circle1}>
          {Users.length >= 2 && <Image source={{ uri: Users[2] }} style={[styles.dp, { height: hp('8%'), width: hp('8%'), top: 35, right: 35 }]} />}
          {Users.length >= 3 && <Image source={{ uri: Users[3] }} style={[styles.dp, { height: hp('8%'), width: hp('8%'), left: 35, bottom: 35 }]} />}
          <View style={styles.circle2}>
            {Users.length >= 0 && <Image source={{ uri: Users[0] }} style={[styles.dp, { top: 0, left: 0 }]} />}
            {Users.length >= 1 && <Image source={{ uri: Users[1] }} style={[styles.dp, { right: 0, bottom: 0 }]} />}
            <LinearGradient style={{ borderRadius: wp('100%') }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
              <TouchableOpacity disabled={ringingLoader} onPress={this.callRandomUser}>
                {ringingLoader ? (
                  <View style={styles.centerButton}>
                    <ActivityIndicator color="#000" />
                  </View>
                ) : (
                    <View style={styles.centerButton}>
                      <Image source={Call} />
                      <Text style={[styles.txtUpgradetopro, { fontSize: 20, textAlign: 'center', fontWeight: '500' }]}>Start{`\n`}Ringing</Text>
                    </View>
                  )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    )
  }

  renderFinalModal = (data) => {
    const { isCallModalVisible, continueLoader } = this.state

    return (
      <Modal style={styles.finalModal} isVisible={isCallModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.innerContainer}>
            <LinearGradient style={styles.profileView} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
              <Image source={{ uri: data.FilePath }} style={styles.profile} />
            </LinearGradient>
            <Text style={[styles.modalText, { fontSize: wp('6%'), fontFamily: FONTS._BOLD }]}>{`${data.FirstName} ${data.LastName}`}</Text>
            <Text style={[styles.modalText, {
              marginTop: 0,
              color: 'darkgray',
              fontSize: wp('4%'),
              marginBottom: 10
            }]}>{`Age : ${data.Age} years`}</Text>
            <Text style={[styles.modalText, { marginTop: 0 }]}>We found a Match for you</Text>
            <Text style={[styles.modalText, { marginTop: wp('5%') }]}>Do you want to continue with your match?</Text>
            <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={this.onContinue}>
                <LinearGradient style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                  {continueLoader ? (
                    <View style={{ paddingVertical: 8 }}>
                      <ActivityIndicator color="#000" />
                      <Text style={styles.waitingText}>{`Please wait for \n your match's Response`}</Text>
                    </View>
                  ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign name="check" size={22} />
                        <Text style={styles.seemeeText}>Continue</Text>
                      </View>
                    )}
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
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.users.userData,
  }
};

export default connect(mapStateToProps, { fetchUserDataById })(Matching);
