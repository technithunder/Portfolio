import {StyleSheet} from 'react-native'
import { hp } from '../../helper/constants'

export default StyleSheet.create({
  bottomContainer: {
    flexDirection: 'row',
    height: hp('9%')
  },
  mainSection: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  subSection: {
    flex: 3,
    backgroundColor: '#ffffff'
  },
  floatContainer1: {
    flex: 3,
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  btn: {
    height: 80,
    width: 80,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
})