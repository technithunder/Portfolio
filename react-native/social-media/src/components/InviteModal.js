import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

//files
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FONTS, WIDTH, hp } from '../helper/constants';

class InviteModal extends Component {

    state = {
        email: '',
    }

  render() {
    const { isModalVisible, closeModal, closeModal1 } = this.props
    return (
      <Modal isVisible={isModalVisible}>
        <View style={styles.outerContainer}>
          <LinearGradient style={styles.innerContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
            <FontAwesome onPress={closeModal1} style={styles.close} name="close" size={22} />
            <Text style={styles.text}>Enter email of your friend</Text>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="darkgray"
              value={this.state.email}
              style={styles.emailInput}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(val) => this.setState({ email: val })}
            />
            <TouchableOpacity style={styles.btn} onPress={() => closeModal(this.state.email)}>
              <Text style={styles.btnText}>Send Invitation</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    )
  }
}

const styles = {
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer: {
    backgroundColor: '#FFF',
    width: WIDTH - 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 15
  },
  img: {
    width: '80%',
    height: 150,
    marginTop: 10,
    backgroundColor: '#fff',
    resizeMode: "contain",
    borderRadius: 10,
  },
  text: {
    fontFamily: FONTS._BOLD,
    marginTop: 20,
    fontSize: 22,
    textAlign: 'center',
    marginHorizontal: 20
  },
  btn: {
    backgroundColor: '#fff',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  btnText: {
    fontFamily: FONTS._BOLD,
    textTransform: 'uppercase'
  },
  emailInput: {
    backgroundColor: '#F5F5F5',
    paddingVertical: hp('2%'),
    paddingHorizontal: 30,
    borderRadius: 50,
    fontFamily: FONTS.BOOK,
    width: '80%',
    marginTop: hp('3%'),
  },
}

export default InviteModal;