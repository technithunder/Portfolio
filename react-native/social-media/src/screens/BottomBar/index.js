import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Keyboard, BackHandler, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';
import { fetchUserDataById } from '../../redux/actions';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
//styles
import styles from './styles';
import Chat from '../../../assets/images/chat.png';
import ChatActive from '../../../assets/images/chat_active.png';
import Profile from '../../../assets/images/profile.png';
import ProfileActive from '../../../assets/images/profile_active.png';
import { hp } from '../../helper/constants'
import WarningModal from '../../components/Modal';
import { requestFirebase } from '../../../notificationservice';

export class Index extends Component {

  constructor(props) {
    super(props)

    this.keyboardWillShow = this.keyboardWillShow.bind(this)
    this.keyboardWillHide = this.keyboardWillHide.bind(this)
  }

  state = {
    activestate: '',
    Modaltext: '',
    isModalVisible: false,
    isVisible: true
  };

  render() {
    return this.state.isVisible ? this.renderMainView() : null
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

  onPressBackHandler = () => {
    this.backHandlerListner = BackHandler.addEventListener('hardwareBackPress', () => {
      if (global.page == 'chat') {
        this.props.navigation.goBack();
        global.page = 'bottombar'
      } else if (global.page == 'videocall') {
        return true;
      } else if (global.page == 'bottombar') {
        BackHandler.exitApp();
      }
    });
  }

  async componentDidMount() {
    global.page = 'bottombar'
    this.props.fetchUserDataById()
    this.getForegroudNotification()
    this.onPressBackHandler()
    requestFirebase(this.props);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
    this.backHandlerListner.remove()
  }

  keyboardWillShow = event => {
    this.setState({
      isVisible: false
    })
  }

  keyboardWillHide = event => {
    this.setState({
      isVisible: true
    })
  }

  getForegroudNotification = () => {
    this.unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = JSON.parse(remoteMessage.data.data)
        console.log('notification data bottom, bar', data)
      if (remoteMessage.data.type == 'call') {
        this.props.navigation.navigate('CallRequest', { callData: data });
      }

      if (remoteMessage.data.type == 'friendcall') {
        this.props.navigation.navigate('CallRequest', { callData: data, from: 'friendcall' });
      }
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // console.log('Message handled in the background!', remoteMessage);
      const data = JSON.parse(remoteMessage.data.data)
      if (remoteMessage.data.type == 'call') {
        this.props.navigation.navigate('CallRequest', { callData: data, from: 'backgroundNotification' });
      }

      if (remoteMessage.data.type == 'friendcall') {
        this.props.navigation.navigate('CallRequest', { callData: data, from: 'friendcall' });
      }
    });
  }

  componentWillUnmount = () => {
    this.unsubscribe()
  }

  onPressChatBtn = () => {
    this.setState({ activestate: 'chat' });
    this.props.navigation.navigate('Message');
  };

  onPressProfileBtn = () => {
    this.setState({ activestate: 'profile' });
    this.props.navigation.navigate('Profile');
  };

  onPressMatchinBtn = () => {
    this.setState({ activestate: 'matching' });
    this.props.navigation.navigate('Matching');
  };

  closeModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
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
    const { activestate, isModalVisible, Modaltext } = this.state;

    return (
      <View>
        <TouchableOpacity
          style={{ position: 'absolute', zIndex: 999, alignSelf: 'center' }}
          activeOpacity={1}
          onPress={this.onPressMatchinBtn}>
          <LinearGradient
            style={styles.btn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#FBE364', '#87F484']}>
            <AntDesign name="home" size={40} />
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ height: hp('6%') }}>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.mainSection, { borderTopRightRadius: 20 }]}
            onPress={this.onPressChatBtn}>
            <Image source={activestate === 'chat' ? ChatActive : Chat} />
          </TouchableOpacity>
          <View style={styles.subSection}>
            <View style={styles.floatContainer1} />
            <View style={{ flex: 1, backgroundColor: '#fff' }} />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.mainSection, { borderTopLeftRadius: 20 }]}
            onPress={this.onPressProfileBtn}>
            <Image source={activestate === 'profile' ? ProfileActive : Profile} />
          </TouchableOpacity>
        </View>
        <WarningModal
          Modaltext={Modaltext}
          isModalVisible={isModalVisible}
          closeModal={this.closeModal}
        />
      </View>
    );
  };
}

export default connect(null, { fetchUserDataById })(Index);
