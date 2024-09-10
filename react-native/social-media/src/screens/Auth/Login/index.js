import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import Axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';

//styles
import styles from './styles';
import { Layout } from '@ui-kitten/components';
import loginImage from '../../../../assets/images/loginImage.png';
import fbImage from '../../../../assets/images/facebook.png';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL, emailRegex, validation, reset, FONTS } from '../../../helper/constants';
import Promises from '../../../helper/Promises';
import WarningModal from '../../../components/Modal';
import { requestFirebase } from '../../../../notificationservice';
import Auth from './Auth';
import AppleLogin from '../../../components/AppleLogin';

class Index extends Component {
  state = {
    email: '',
    password: '',
    coords: '',
    loading: false,
    fbLoading: false,
    Modaltext: '',
    isModalVisible: false,
    fcmToken: '',
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

  onRegisterPress = () => {
    this.props.navigation.navigate('Signup');
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
    global.page = 'login'
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


  fbLogin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const accessToken = data.accessToken;
            const responseInfoCallback = (error, datas) => {
              if (error) {
                console.log(error);
                console.log('Error fetching data=', error.toString());
              } else {
                this.signupAPIFB(datas);
              }
            };
            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken,
                parameters: {
                  fields: {
                    string: 'email,name,first_name,middle_name,last_name',
                  },
                },
              },
              responseInfoCallback,
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      (error) => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  signupAPIFB = (data) => {
    const { fcmToken } = this.state;
    const obj = {
      FacebookId: data.id,
      FcmToken: fcmToken,
      Username: data.email,
      FirstName: data.name.givenName
    };
    this.setState({ fbLoading: true });
    Axios.post(`${BASE_URL}User/Login`, obj)
      .then((res) => {
        this.setState({ fbLoading: false });
        if (res.data.messageType === 'success') {
          const resData = res.data.data;
          Promises.setUserToken(resData.userDetail.AuthToken);
          Promises.setUsersKey(resData.userDetail.UserId);
          if (resData.issignup) {
            reset(this.props, 'Disclaimer')
          } else {
            reset(this.props, 'BottomBar', { from: 'login' })
          }
        } else {
          this.setState({ Modaltext: res.data.message, isModalVisible: true })
        }
      })
      .catch((error) => {
        this.setState({ fbLoading: false });
        this.setState({ Modaltext: 'Something went wrong', isModalVisible: true })
        console.log(error);
      });
  };

  loginAPI = () => {
    const { email, password, coords, fcmToken } = this.state;
    const validations = validation(email, password);
    if (typeof validations === 'boolean') {
      if (emailRegex.test(email)) {
        this.setState({ loading: true });
        const obj = {
          Username: email,
          Password: password,
          FcmToken: fcmToken,
        };
        Axios.post(`${BASE_URL}User/Login`, obj)
          .then((res) => {
            this.setState({ loading: false });
            if (res.data.messageType === 'success') {
              const resData = res.data.data;
              if (resData.tFEnable) {
                this.setState({ isModal: true });
              } else {
                Promises.setUserToken(resData.userDetail.AuthToken);
                Promises.setUsersKey(resData.userDetail.UserId);
                reset(this.props, 'BottomBar', { from: 'login' })
              }
            } else {
              this.setState({ Modaltext: res.data.message, isModalVisible: true })
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            console.log(error);
            this.setState({ Modaltext: 'Something went wrong', isModalVisible: true })
          });
      } else {
        this.setState({ Modaltext: 'Please enter valid email', isModalVisible: true })
      }
    } else {
      this.setState({ Modaltext: validations, isModalVisible: true, })
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
        }
      })
      .catch(err => console.log(err))
  }

  onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
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
    const { loading, fbLoading, isModalVisible, Modaltext, isModal, error } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Layout style={styles.container}>
          <Image source={loginImage} style={styles.bgImage} />
          <Text style={styles.title}>
            SEE<Text style={{ fontFamily: 'Circular Std Book' }}>MEE</Text>
          </Text>
          <Layout style={styles.loginBody}>
            <Text style={styles.signupText}>Login</Text>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="darkgray"
              value={this.state.email}
              style={styles.emailInput}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(val) => this.setState({ email: val })}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="darkgray"
              value={this.state.password}
              secureTextEntry={true}
              style={[styles.emailInput, { marginTop: 20 }]}
              onChangeText={(val) => this.setState({ password: val })}
            />
            <View style={styles.bodyContainer2}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, alignItems: 'center' }}>
                <Text style={{
                  fontFamily: FONTS.BOOK,
                  fontSize: 18,
                }} onPress={() => this.props.navigation.navigate('ForgetPassword')}>
                  Forget password?
                  </Text>
                <TouchableOpacity
                  style={styles.signupBtn}
                  onPress={this.loginAPI}>
                  <LinearGradient
                    style={styles.btnInner}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FBE364', '#87F484']}>
                    {loading ? (
                      <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.btnText}>Login</Text>
                      )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.divider}>
                <View style={styles.border} />
                <View style={styles.orView}>
                  <Text style={styles.orText}>OR</Text>
                </View>
                <View style={styles.border} />
              </View>
              <TouchableOpacity
                style={[styles.fbBtn, { justifyContent: 'center' }]}
                onPress={this.fbLogin}>
                {fbLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={fbImage} style={styles.fbLogo} />
                      <Text style={[styles.btnText, { color: '#ffffff' }]}>
                        Login using facebook
                    </Text>
                    </View>
                  )}
              </TouchableOpacity>
              {Platform.OS === 'ios' && (
                <AppleLogin signupAPIFB={this.signupAPIFB} />
              )}
              <TouchableOpacity onPress={this.onRegisterPress}>
                <Text style={[styles.btnLogin]}>
                  New User? <Text style={{ color: '#87F484' }}>Signup</Text>
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
      </ScrollView >
    );
  };
}

export default Index;
