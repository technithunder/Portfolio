import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { requestFirebase } from '../../../../notificationservice';
import { FONTS } from '../../../helper/constants';

//styles
import styles from './styles';
import { Layout } from '@ui-kitten/components';
import loginImage from '../../../../assets/images/loginImage.png';
import LinearGradient from 'react-native-linear-gradient';
import Axios from 'axios';
import { BASE_URL, emailRegex, validation, reset } from '../../../helper/constants';
import Promises from '../../../helper/Promises';
import WarningModal from '../../../components/Modal';

class Index extends Component {
  state = {
    email: '',
    loading: false,
    fcmToken: '',
    fbLoading: false,
    Modaltext: '',
    isModalVisible: false,
    newPass: '',
    cPass: '',
    status: '',
    otp: ''
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
  };

  resetPassword = () => {
    this.setState({loading: true})
    const obj = {
      verificationCode: this.state.otp,
      password: this.state.newPass
    }
    Axios.post(`${BASE_URL}User/ResetPassword`, obj)
      .then(res => {
        this.setState({loading: false})
        console.log(res.data);
        if (res.data.messageType == 'Failure') {
          Alert.alert(res.data.message);
        } else {
          Alert.alert(
            `Success`,
            `Your password changed successfully` ,
            [
              {text: 'OKAY', onPress: () => this.props.navigation.goBack()},
            ],
            { cancelable: false }
          )
        }
      })
      .catch(err => {
        this.setState({loading: false})
        console.log(err)
      })
  }

  forgotPassword = () => {
    this.setState({loading: true})
    Axios.get(`${BASE_URL}User/ForgetPassword?email=${this.state.email}`)
      .then(res => {
        this.setState({ status: 'emailEntered', loading: false })
      })
      .catch(err => {
        this.setState({loading: false})
        console.log(err)
      })
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
    const { loading, isModal, Modaltext, isModalVisible, error, status } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Layout style={styles.container}>
          <Image source={loginImage} style={styles.bgImage} />
          <Text style={styles.title}>
            SEE<Text style={{ fontFamily: 'Circular Std Book' }}>MEE</Text>
          </Text>
          <Layout style={styles.loginBody}>
            <Text style={styles.signupText}>Forget password?</Text>
            {status == '' && this.renderEmailView()}
            {status == 'emailEntered' && this.renderOtpView()}
            {status == 'otpEntered' && this.renderNewPasswordView()}
          </Layout>
          <WarningModal
            Modaltext={Modaltext}
            isModalVisible={isModalVisible}
            closeModal={() => this.setState({ isModalVisible: false })}
          />
        </Layout>
      </ScrollView>
    );
  };

  renderEmailView = () => {
    const { loading, email } = this.state;

    return (
      <View>
        <TextInput
          placeholder="Email address"
          placeholderTextColor="darkgray"
          value={this.state.email}
          style={styles.emailInput}
          autoCapitalize="none"
          onChangeText={(email) => this.setState({ email })}
        />
        <View style={styles.bodyContainer2}>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => {
              if (!email) {
                this.setState({ Modaltext: 'Please enter your email-address', isModalVisible: true })
              } else if (!emailRegex.test(email)) {
                this.setState({ Modaltext: 'please enter valid email-address', isModalVisible: true })
              } else {
                this.forgotPassword();
              }
            }}>
            <LinearGradient
              style={styles.btnInner}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={['#FBE364', '#87F484']}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                  <Text style={styles.btnText}>Reset</Text>
                )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderOtpView = () => {
    const { loading, otp, newPass, cPass } = this.state;

    return (
      <View>
        <Text style={{
          fontFamily: FONTS.BOOK,
          fontSize: 18,
          marginTop: 15
        }}>Please check your Email Inbox, and enter your one time password (OTP) below to reset your password</Text>
        <TextInput
          placeholder="Enter your OTP"
          placeholderTextColor="darkgray"
          value={this.state.otp}
          style={styles.emailInput}
          autoCapitalize="none"
          keyboardType="number-pad"
          onChangeText={(val) => this.setState({ otp: val })}
        />
        <TextInput
          placeholder="New password"
          placeholderTextColor="darkgray"
          value={newPass}
          style={styles.emailInput}
          autoCapitalize="none"
          onChangeText={(val) => this.setState({ newPass: val })}
        />
        <TextInput
          placeholder="Confirm password"
          placeholderTextColor="darkgray"
          value={cPass}
          style={styles.emailInput}
          autoCapitalize="none"
          onChangeText={(val) => this.setState({ cPass: val })}
        />
        <View style={styles.bodyContainer2}>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => {
              if (!otp) {
                this.setState({ Modaltext: 'Please enter your otp', isModalVisible: true })
              } else if(!newPass){
                this.setState({ Modaltext: 'Please enter your new password', isModalVisible: true })
              }else if(!cPass){
                this.setState({ Modaltext: 'Please enter your confirm password', isModalVisible: true })
              }else if(newPass != cPass){
                this.setState({ Modaltext: 'Passwords must be same', isModalVisible: true })
              }else{
                this.resetPassword()
              }
            }}>
            <LinearGradient
              style={styles.btnInner}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={['#FBE364', '#87F484']}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                  <Text style={styles.btnText}>Reset</Text>
                )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderNewPasswordView = () => {
    const { loading, otp } = this.state;

    return (
      <View>
        <TextInput
          placeholder="password"
          placeholderTextColor="darkgray"
          value={this.state.newPass}
          style={styles.emailInput}
          autoCapitalize="none"
          onChangeText={(value) => this.setState({ newPass: value })}
        />
        <TextInput
          placeholder="confirm password"
          placeholderTextColor="darkgray"
          value={this.state.cPass}
          style={styles.emailInput}
          autoCapitalize="none"
          onChangeText={(value) => this.setState({ cPass: value })}
        />
        <View style={styles.bodyContainer2}>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => {
              if (!otp) {
                this.setState({ Modaltext: 'Please enter your otp', isModalVisible: true })
              } else {
                this.setState({ status: 'otpEntered' })
              }
            }}>
            <LinearGradient
              style={styles.btnInner}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={['#FBE364', '#87F484']}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                  <Text style={styles.btnText}>Reset</Text>
                )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Index;
