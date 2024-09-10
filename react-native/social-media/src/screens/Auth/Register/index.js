import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { requestFirebase } from '../../../../notificationservice';

//styles
import styles from './styles';
import { Layout } from '@ui-kitten/components';
import loginImage from '../../../../assets/images/loginImage.png';
import LinearGradient from 'react-native-linear-gradient';
import Axios from 'axios';
import { BASE_URL, emailRegex, validation, reset } from '../../../helper/constants';
import Promises from '../../../helper/Promises';
import WarningModal from '../../../components/Modal';
import Auth from './Auth';

class Index extends Component {
  state = {
    email: '',
    password: '',
    cpassword: '',
    loading: false,
    fcmToken: '',
    fbLoading: false,
    Modaltext: '',
    isModalVisible: false,
    isModal: false,
    error: ''
  };

  render() {
    return this.renderMainView();
  }

  /*
  .##....##....###....##.....##.####..######......###....########.####..#######..##....##
  .###...##...##.##...##.....##..##..##....##....##.##......##.....##..##.....##.###...##
  .####..##..##...##..##.....##..##..##.........##...##.....##.....##..##.....##.####..##
  .##.##.##.##.....##.##.....##..##..##...####.##.....##....##.....##..##.....##.##.##.##
  .##..####.#########..##...##...##..##....##..#########....##.....##..##.....##.##..####
  .##...###.##.....##...##.##....##..##....##..##.....##....##.....##..##.....##.##...###
  .##....##.##.....##....###....####..######...##.....##....##....####..#######..##....##
  */

  onLoginPress = () => {
    this.props.navigation.navigate('Login');
  };

  /* 
  .##........#######...######...####..######.
  .##.......##.....##.##....##...##..##....##
  .##.......##.....##.##.........##..##......
  .##.......##.....##.##...####..##..##......
  .##.......##.....##.##....##...##..##......
  .##.......##.....##.##....##...##..##....##
  .########..#######...######...####..######.
  */

  componentDidMount = () => {
    global.page = 'signup'
    this.requestUserPermission();
  };

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const token = await messaging().getToken();
      this.setState({ fcmToken: token }, () => {
        console.log('!!!!!!!!!!!!!!!!!', token)
        requestFirebase()
      });
    }
  };

  signupAPI = () => {
    const { email, password, fcmToken, cpassword } = this.state;
    const validations = validation(email, password);
    if (typeof validations === 'boolean') {
      if (emailRegex.test(email)) {
        if (cpassword.length == 0) {
          this.setState({ Modaltext: 'Please enter confirm password', isModalVisible: true })
        } else if (password != cpassword) {
          this.setState({ Modaltext: 'Password and Cofirm password must be same', isModalVisible: true })
        } else {
          const obj = {
            Username: email,
            Password: password,
            IsFacebookLogin: false,
            IsNotificationEnable: true,
            FcmToken: fcmToken,
          };
          console.log(obj);
          this.setState({ loading: true });
          Axios.post(`${BASE_URL}User/Registration`, obj)
            .then((res) => {
              const { data } = res.data;
              console.log(data, 'signUp res data')
              this.setState({ loading: false });
              if (res.data.messageType === 'Failure') {
                this.setState({ Modaltext: res.data.message, isModalVisible: true })
              } else {
                this.setState({ isModal: true });
              }
            })
            .catch((error) => {
              this.setState({ loading: false });
              console.log(error);
              this.setState({ Modaltext: 'Something went wrong', isModalVisible: true })
            });
        }

      } else {
        this.setState({ Modaltext: 'Please enter valid email', isModalVisible: true })
      }
    } else {
      this.setState({ Modaltext: validations, isModalVisible: true })
    }
  };

  closeModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible, isModal: false })
  }

  verfiyAPI = (code) => {
    const data = {
      verificationCode: code,
      FcmToken: this.state.fcmToken
    }
    Axios.post(`${BASE_URL}User/TFALogin`, data)
      .then(res => {
        const { data } = res.data;
        if (data) {
          this.setState({ isModal: false })
          Promises.setUserToken(data.userDetail.AuthToken);
          Promises.setUsersKey(data.userDetail.UserId);
          reset(this.props, 'Disclaimer')
        } else {
          this.setState({ error: 'Code  is wrong, try again' })
        }
      })
      .catch(err => console.log(err))
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
    const { loading, isModal, Modaltext, isModalVisible, error } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Layout style={styles.container}>
          <Image source={loginImage} style={styles.bgImage} />
          <Text style={styles.title}>
            SEE<Text style={{ fontFamily: 'Circular Std Book' }}>MEE</Text>
          </Text>
          <Layout style={styles.loginBody}>
            <Text style={styles.signupText}>Sign up</Text>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="darkgray"
              value={this.state.email}
              style={styles.emailInput}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({ email })}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="darkgray"
              value={this.state.password}
              secureTextEntry
              style={[styles.emailInput, { marginTop: 20 }]}
              onChangeText={(password) => this.setState({ password })}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="darkgray"
              value={this.state.cpassword}
              secureTextEntry
              style={[styles.emailInput, { marginTop: 20 }]}
              onChangeText={(cpassword) => this.setState({ cpassword })}
            />
            <View style={styles.bodyContainer2}>
              <TouchableOpacity
                style={styles.signupBtn}
                onPress={this.signupAPI}>
                <LinearGradient
                  style={styles.btnInner}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  colors={['#FBE364', '#87F484']}>
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                      <Text style={styles.btnText}>Sign Up</Text>
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

              <TouchableOpacity onPress={this.onLoginPress}>
                <Text style={[styles.btnLogin]}>
                  Already have an account?{' '}
                  <Text style={{ color: '#87F484' }}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Layout>
          <WarningModal
            Modaltext={Modaltext}
            isModalVisible={isModalVisible}
            closeModal={this.closeModal}
          />
          <Auth
            isModalVisible={isModal}
            closeModal={this.closeModal}
            verfiyAPI={this.verfiyAPI}
            errorText={error}
          />
        </Layout>
      </ScrollView>
    );
  };
}

export default Index;
