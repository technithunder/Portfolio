import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  BackHandler,
  Alert
} from "react-native";
import { CheckBox } from '@ui-kitten/components';
import LinearGradient from "react-native-linear-gradient";
import IceBreaker from '../../../assets/images/iceBreaker.png'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import messaging from '@react-native-firebase/messaging';
import WarningModal from '../../components/Modal';
import Modal from 'react-native-modal';
import { fetchUserDataById } from '../../redux/actions';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from "react-native-twilio-video-webrtc";

import style from "./styles";
import { BASE_URL, wp } from "../../helper/constants";
import { connect } from "react-redux";
import Axios from "axios";
import Promises from "../../helper/Promises";
import { Timer } from "./timer";
import { Timer10 } from "./Timer10";

const styles = StyleSheet.create(style);


const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

const index = (props) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [status, setStatus] = useState("disconnected");
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("pixel");
  const [userData, setUserData] = useState("");
  const [icebreaker, setIcebreaker] = useState("")
  const [icebreakerCount, setIcebreakerCount] = useState(props.user.IceBreakCount)
  const [blockAlert, setBlockAlert] = useState(false)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [hideTimer, setHideTimer] = useState(true)
  const [Modaltext, setModalText] = useState("")
  const [secs, setSecs] = useState(60)
  const [secs10, setSecs10] = useState(20)
  const twilioVideo = useRef(null);

  const [nudityCheck, setNudityCheck] = React.useState(false);
  const [harrashCheck, setHarrashCheck] = React.useState(false);
  const [abusiveCheck, setAbusiveCheck] = React.useState(false);
  const [racismCheck, setRacismCheck] = React.useState(false);
  const [otherCheck, setOtherCheck] = React.useState(false);



  useEffect(() => {
    props.fetchUserDataById()
    global.page = 'videocall'
     setToken(props.route.params.url)
     setRoomName(props.route.params.room)
     setUserData(props.route.params.userData)
     _onConnectButtonPress(props.route.params.url, props.route.params.room)
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = JSON.parse(remoteMessage.data.data)

      if (remoteMessage.data.type == 'skipResponse') {
        setIsModalVisible(true)
        setModalText(`${userData.firstname} has skipped the call`)
      }

      if (remoteMessage.data.type == 'blockResponse') {
        setIsModalVisible(true)
        setModalText(`${userData.firstname} has leave the call`)
      }
    });
    return () => {
      backHandler.remove()
      unsubscribe()
    }
  }, [])

  const onVideoEnable = () => {
    setIsVideoEnabled(true)
  }

  const showPopup = () => {
    setReviewModalVisible(true)
  }

  const _onConnectButtonPress = async (url, room) => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    twilioVideo.current.connect({ accessToken: url, roomName: room });
    setStatus("connecting");
  };

  const _onEndButtonPress = async () => {
    const token = await Promises.getUserToken()
    Axios.get(`${BASE_URL}User/UpdateUserCallStatus?userId=${props.user.UserId}&roomName=${roomName}`, {
      headers: createHeaders(token)
    })
      .then(res => {
        twilioVideo.current.disconnect();
        props.navigation.goBack()
      })
      .catch(err => console.log(err))
  };

  const skipUserApi = async () => {
    const token = await Promises.getUserToken()
    const from = props.route.params.from;
    const data = {};
    data['skipUserId'] = from == 'callRequest' ? userData.callOwnerId : userData.callAcceptId;

    Axios.post(`${BASE_URL}User/SkipUser`, data, {
      headers: createHeaders(token)
    })
      .then(res => {
        _onEndButtonPress();
      })
      .catch(err => console.log(err))
  }

  const _onRoomDidConnect = ({ roomName, error }) => {
    setStatus("connected", roomName, error);

  };

  const _onRoomDidDisconnect = ({ error }) => {
    console.log("ERROR: ", error);
    setStatus("disconnected");
  };

  const _onRoomDidFailToConnect = (error) => {
    console.log("ERROR: ", error);

    setStatus("disconnected");
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    const videoTracks = new Map(videoTracks);
    videoTracks.delete(track.trackSid);

    setVideoTracks(videoTracks);
    _onEndButtonPress()
  };

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Need permission to access microphone",
        message:
          "To run this demo we need permission to access your microphone",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: "Need permission to access camera",
      message: "To run this demo we need permission to access your camera",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    });
  };

  const _onPressIceBreaker = async () => {
    if (icebreakerCount == 0) {
      Alert.alert('You have to purchase Icebreaker');
    } else {
      const token = await Promises.getUserToken()
      Axios.get(`${BASE_URL}IceBreakContent/GetIceBreakContent`, {
        headers: createHeaders(token),
      })
        .then(res => {
          if (res.data.data != null) {
            setIcebreaker(res.data.data.data.IcebreakText)
            setIcebreakerCount(icebreakerCount - 1);
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const onBlockPress = async () => {
    const token = await Promises.getUserToken()
    const from = props.route.params.from
    const data = {
      userId: props.user.UserId,
      NuditySexuality: nudityCheck,
      AbusiveLanguage: abusiveCheck,
      Harassment: harrashCheck,
      Racism: racismCheck
    }

    data['blockUserId'] = from == 'callRequest' ? userData.callOwnerId : userData.callAcceptId;

    Axios.post(`${BASE_URL}User/BlcokUser`, data, {
      headers: createHeaders(token)
    })
      .then(res => {
        _onEndButtonPress();
      })
      .catch(err => console.log(err))
  }

  const reviewUser = async (addAs) => {
    const token = await Promises.getUserToken()
    const from = props.route.params.from
    const data = {
      UserId: props.user.UserId,
      status: 'Like'
    }

    data['FriendId'] = from == 'callRequest' ? userData.callOwnerId : userData.callAcceptId;

    Axios.post(`${BASE_URL}UserLikeDislike/Save`, data, {
      headers: createHeaders(token)
    })
      .then(res => {
        if (addAs == 'friend') {
          _onEndButtonPress()
        } else {
          setHideTimer(false);
          setReviewModalVisible(false)
        }
      })
      .catch(err => console.log(err))
  }

  const _reviewUser1 = async () => {
    const token = await Promises.getUserToken()
    const from = props.route.params.from
    const data = {
      UserId: props.user.UserId,
      status: 'disLike'
    }

    data['FriendId'] = from == 'callRequest' ? userData.callOwnerId : userData.callAcceptId;

    Axios.post(`${BASE_URL}UserLikeDislike/Save`, data, {
      headers: createHeaders(token)
    })
      .then(res => {
        _onEndButtonPress()
      })
      .catch(err => console.log(err))
  }

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera();
  };

  const renderBlockAlertModal = () => {
    return (
      <Modal isVisible={blockAlert} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.innerContainer, { paddingVertical: wp('3%') }]}>
          <Text style={[styles.modalText, { marginTop: 10 }]}>Please give us the reason</Text>
          <View style={{ paddingHorizontal: 50 }}>
            <CheckBox
              style={{ margin: 5, marginTop:10 }}
              checked={nudityCheck}
              onChange={nextChecked => setNudityCheck(nextChecked)}>
              Nudity/Sexuality
          </CheckBox>
            <CheckBox
              style={{ margin: 5 }}
              checked={abusiveCheck}
              onChange={nextChecked => setAbusiveCheck(nextChecked)}>
              Abusive Language
          </CheckBox>
            <CheckBox
              style={{ margin: 5 }}
              checked={harrashCheck}
              onChange={nextChecked => setHarrashCheck(nextChecked)}>
              Harassment
          </CheckBox>
            <CheckBox
              style={{ margin: 5 }}
              checked={racismCheck}
              onChange={nextChecked => setRacismCheck(nextChecked)}>
              Racism
          </CheckBox>
          </View>
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={onBlockPress}>
              <LinearGradient style={[styles.btn, { paddingHorizontal: 10 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                <AntDesign name="check" size={22} />
                <Text style={styles.seemeeText}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setBlockAlert(false)}>
              <View style={[styles.btn, { backgroundColor: '#E7E7E7', paddingHorizontal: 10 }]}>
                <AntDesign name="close" size={22} />
                <Text style={styles.seemeeText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  const renderReviewModal = () => {
    return (
      <Modal isVisible={reviewModalVisible} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.innerContainer}>
          <LinearGradient style={styles.profileView} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
            <Image source={{ uri: userData.FilePath }} style={styles.profile} />
          </LinearGradient>
          <Text style={styles.modalText}>{`How do you feel about ${userData.firstname}?`}</Text>
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => reviewUser('like')}>
              <LinearGradient style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                <AntDesign name="check" size={22} />
                <Text style={styles.seemeeText}>Continue Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={_reviewUser1}>
              <View style={[styles.btn, { backgroundColor: '#E7E7E7' }]}>
                <AntDesign name="close" size={22} />
                <Text style={styles.seemeeText}>I'll Pass</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.divider}>
            <View style={styles.border} />
            <View style={styles.orView}>
              <Text style={styles.orText}>OR</Text>
            </View>
            <View style={styles.border} />
          </View>
          <TouchableOpacity onPress={() => reviewUser('friend')}>
            <View style={[styles.btn, { backgroundColor: '#E7E7E7' }]}>
              <Text style={styles.seemeeText}>Add to friends list and keep ringing</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      {status === "disconnected" && (
        <LinearGradient
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#FBE364', '#87F484']}>
          <ActivityIndicator color="#000" size="large" />
        </LinearGradient>
      )}

      {(status === "connected" || status === "connecting") && (
        <View style={styles.callContainer}>
          {status === "connected" && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <View style={{ flex: 1 }}>
                    <TwilioVideoParticipantView
                      style={styles.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />
                    {!isVideoEnabled && <View style={styles.cover} >
                      <Text style={{ color: '#FFF' }}>
                        {`Blackout phase & Skip end in..`}
                      </Text>
                      <Timer10 seconds={secs10} onVideoEnable={onVideoEnable} />
                    </View>}
                    <View style={styles.header}>
                      {hideTimer && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isVideoEnabled && <Timer seconds={secs} showPopup={showPopup} endCall={_onEndButtonPress} />}
                      </View>}
                      <TouchableOpacity onPress={() => setBlockAlert(true)}>
                        <Feather color="#fff" size={wp('7%')} name="flag" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.userInfo}>
                      <View>
                        <Text style={styles.userName}>{userData.firstname} {userData.lastname}</Text>
                        <Text style={styles.age}>{userData.age} year</Text>
                      </View>
                      {!isVideoEnabled && (<TouchableOpacity style={styles.skipBtn} onPress={skipUserApi}>
                        <View style={styles.skipCountBtn}>
                          <Text style={styles.skipCount}>{props.user.UserSkipCount}</Text>
                        </View>
                        <Text style={styles.skipText}>Free skip</Text>
                      </TouchableOpacity>)}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          <View style={{ flex: 1 }}>
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
            <View style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              left: 20,
              zIndex: 999,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              {!hideTimer && (
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around'
                }}>
                  <TouchableOpacity style={styles.callBtn} onPress={_onMuteButtonPress}>
                    <Ionicons name={isAudioEnabled ? "volume-high" : "volume-mute"} size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.callBtn, { backgroundColor: 'red' }]} onPress={_onEndButtonPress}>
                    <Ionicons name="call" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.callBtn} onPress={_onFlipButtonPress}>
                    <MaterialIcons name="flip-camera-ios" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.iceBreaker}>{icebreaker}</Text>
              <TouchableOpacity style={styles.iceBtn} onPress={_onPressIceBreaker}>
                <View style={styles.iceCount}>
                  <Text style={styles.skipCount}>{icebreakerCount}</Text>
                </View>
                <Image source={IceBreaker} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />

      <WarningModal
        Modaltext={Modaltext}
        isModalVisible={isModalVisible}
        closeModal={() => {
          setIsModalVisible(false)
          _onEndButtonPress()
        }}
      />

      {renderBlockAlertModal()}
      {renderReviewModal()}

    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.users.userData
  }
};

export default connect(mapStateToProps, { fetchUserDataById })(index);
