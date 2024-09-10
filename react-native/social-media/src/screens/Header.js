import React, { Component } from 'react'
import { View, StyleSheet, Text, SafeAreaView, Platform } from 'react-native'
import { FONTS, hp } from '../helper/constants'

export default class Header extends Component {
  render() {
    return (
      <SafeAreaView>
        <View style={styles.headerMain}>
            <View style={styles.headerBorder} />
            <Text style={styles.mainHeaderText}>{this.props.name}</Text>
        </View>
          {this.props.subname && <Text style={[styles.mainHeaderText, { fontFamily: FONTS.BOOK, marginLeft: 68 }]}>{this.props.subname}</Text>}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  headerMain: {
    marginTop: Platform.OS == 'android' ? 15 : 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerBorder: {
    backgroundColor: '#96F280',
    height: 5,
    width: 38,
    marginRight: 30
  },
  mainHeaderText: {
    fontSize: hp('5%'),
    fontFamily: FONTS._BOLD,
  },
})
