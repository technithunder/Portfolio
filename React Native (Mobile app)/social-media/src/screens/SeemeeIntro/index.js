import React, { Component } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { Layout } from '@ui-kitten/components'
import styles from './styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { hp, wp } from '../../helper/constants'
import IceBreaker from '../../../assets/images/iceBreaker.png'
import Profile from '../../../assets/images/dp.jpg'
import LinearGradient from 'react-native-linear-gradient';

class SeemeeIntro extends Component {
  state = {
    timer: '0:58',
    isConfirmed: false
  }

  render() {
    return this.renderMainView()
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
    return (
      <Layout style={styles.container}>
        {this.renderFirstBox()}
        {this.renderSecondBox()}
        {/* {this.renderFinalModal()} */}
      </Layout>
    )
  }

  renderFirstBox = () => {
    const { timer, isConfirmed } = this.state

    return (
      <View style={[styles.flexContainer, { backgroundColor: 'black' }]}>
        <ImageBackground style={[styles.bgImage, styles.bgImage1]} source={Profile}>
          <View style={{ flex: 1, paddingHorizontal: wp('4%') }}>
            <View style={styles.header}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign color='#fff' name="arrowleft" size={wp('7%')} />
                {isConfirmed && <Text style={styles.timer}>{timer}</Text>}
              </View>
              <Feather color="#fff" size={wp('7%')} name="flag" />
            </View>
            <View style={styles.userInfo}>
              <View>
                <Text style={styles.userName}>John Doe</Text>
                <Text style={styles.age}>21 year  ·  5 km</Text>
              </View>
              {isConfirmed && (
                <TouchableOpacity style={styles.skipBtn}>
                  <View style={styles.skipCountBtn}>
                    <Text style={styles.skipCount}>2</Text>
                  </View>
                  <Text style={styles.skipText}>skip</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderSecondBox = () => {
    const { isConfirmed } = this.state

    return (
      <View style={[styles.flexContainer, { backgroundColor: 'red' }]}>
        <ImageBackground style={styles.bgImage} source={{ uri: 'https://picsum.photos/600/500' }}>
          {isConfirmed ? (
            <View style={[styles.userInfo, { marginBottom: hp('3%'), paddingHorizontal: wp('4%') }]}>
              <Text style={[styles.age, { flex: 1, fontSize: wp('5%'), marginRight: wp('6%') }]}>Well, here I am. What are your other two wishes?</Text>
              <TouchableOpacity style={styles.iceBtn}>
                <View style={styles.iceCount}>
                  <Text style={styles.skipCount}>2</Text>
                </View>
                <Image source={IceBreaker} />
              </TouchableOpacity>
            </View>
          ) : this.renderConfirmationContainer()}
        </ImageBackground>
      </View>
    )
  }

  renderConfirmationContainer = () => {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient style={styles.confirmationContainer} colors={['transparent', '#000']} >
          <View style={styles.innerContainer}>
            <LinearGradient style={styles.profileView} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
              <Image source={Profile} style={styles.profile} />
            </LinearGradient>
            <Text style={styles.modalText}>How do you feel about Katrina?</Text>
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity >
                <LinearGradient style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                  <AntDesign name="check" size={22} />
                  <Text style={styles.seemeeText}>SEEMEE</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={[styles.btn, { backgroundColor: '#E7E7E7' }]}>
                  <AntDesign name="close" size={22} />
                  <Text style={styles.seemeeText}>Carry on</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    )
  }

  renderFinalModal = () => {
    return(
      <View style={styles.finalModal}>
         <View style={styles.innerContainer}>
            <LinearGradient style={styles.profileView} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
              <Image source={Profile} style={styles.profile} />
            </LinearGradient>
            <Text style={[styles.modalText]}>Yayyy!!</Text>
            <Text style={[styles.modalText, {marginTop: 0}]}>John likes you</Text>
            <Text style={[styles.modalText, {marginTop: wp('5%')}]}>Do you want to continue the video call?</Text>
            <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity >
                <LinearGradient style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FBE364', '#87F484']}>
                  <AntDesign name="check" size={22} />
                  <Text style={styles.seemeeText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.divider}>
                <View style={styles.border} />
                <View style={styles.orView}>
                  <Text style={styles.orText}>OR</Text>
                </View>
                <View style={styles.border} />
              </View>
              <TouchableOpacity>
                <View style={[styles.btn, { backgroundColor: '#E7E7E7' }]}>
                  <Text style={styles.seemeeText}>Add her as a friend</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    )
  }
}

export default SeemeeIntro;