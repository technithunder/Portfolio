import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

//icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FONTS, WIDTH } from '../helper/constants';

class OptionModal extends Component {
  render() {
    const { visible,openCamera,openGallery, modelClose } = this.props;
    return (
      <Modal isVisible={visible}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={modelClose}>
              <FontAwesome color="red" name="close" size={30}/>
            </TouchableOpacity>
            <Text style={styles.txtoptions}>OPTIONS</Text>
            <TouchableOpacity onPress={openCamera}>
              <LinearGradient style={styles.modeloption} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                <AntDesign name="camerao" size={26} />
                <Text style={styles.txtRinging}>Open Camera</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={openGallery}>
              <LinearGradient style={styles.modeloption} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                <AntDesign name="picture" size={26} />
                <Text style={styles.txtRinging}>Open Gallery</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    height: 200,
    width:WIDTH-60,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    alignItems: 'flex-end'
  },
  txtoptions:{
    textAlign:"center",
    fontSize:18,
    fontFamily: FONTS._BOLD,
    marginTop:15
  },
  modeloption:{
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    marginHorizontal:30,
  },
  txtRinging:{
    fontSize: 20,
    color: "#000000",
    fontFamily: FONTS.BOOK,
    paddingLeft: 20
  },
}

export default OptionModal
