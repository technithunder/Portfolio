import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
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

const styles = StyleSheet.create(style);


const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

const index = (props) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [status, setStatus] = useState("disconnected");
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [roomName, setRoomName] = useState("pixel");
  const [userData, setUserData] = useState("");
  const twilioVideo = useRef(null);

  useEffect(() => {
    props.fetchUserDataById()
    global.page = 'videocall2'
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

    return () => {
      backHandler.remove()
    }
  }, [])


  const _onConnectButtonPress = async (url, room) => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    twilioVideo.current.connect({ accessToken: url, roomName: room });
    setStatus("connecting");
  };

  const _onEndButtonPress = async() => {
    twilioVideo.current.disconnect();
    const tokens = await Promises.getUserToken()
    Axios.get(`${BASE_URL}User/UpdateUserCallStatus?userId=${props.user.UserId}&roomName=${roomName}`, {
      headers: createHeaders(tokens)
    })
      .then(res => {
        props.navigation.goBack()
      })
      .catch(err => {
        props.navigation.goBack()
        console.log(err)
      })
  };

  const _onRoomDidConnect = () => {
    setStatus("connected");

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

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera();
  };

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
                    <View style={styles.userInfo}>
                      <View>
                        <Text style={styles.userName}>{userData.firstname} {userData.lastname}</Text>
                        <Text style={styles.age}>{userData.age} year</Text>
                      </View>
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
             <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around'
                }}>
                  <TouchableOpacity style={styles.callBtn} onPress={_onMuteButtonPress}>
                    <Ionicons name="volume-mute" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.callBtn, { backgroundColor: 'red' }]} onPress={_onEndButtonPress}>
                    <Ionicons name="call" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.callBtn} onPress={_onFlipButtonPress}>
                    <MaterialIcons name="flip-camera-ios" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
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

    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.users.userData
  }
};

export default connect(mapStateToProps, { fetchUserDataById })(index);
