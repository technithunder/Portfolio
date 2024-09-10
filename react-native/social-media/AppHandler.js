import React, { Component } from 'react'
import { View, Text, ActivityIndicator, Platform, StatusBar } from 'react-native'
import Promises from './src/helper/Promises'
import SplashScreen from 'react-native-splash-screen'

export default class AppHandler extends Component {

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    SplashScreen.hide()
    const userKey = await Promises.getUsersKey()

    if(!userKey || userKey == null || userKey == undefined){
      this.props.navigation.replace('Login')
    }else{
      this.props.navigation.replace('BottomBar')
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        <ActivityIndicator color="#000"/>
      </View>
    )
  }
}