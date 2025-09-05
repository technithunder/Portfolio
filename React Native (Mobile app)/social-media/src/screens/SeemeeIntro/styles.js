import { Platform, StyleSheet } from 'react-native'
import { FONTS, hp, WIDTH, wp } from '../../helper/constants'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexContainer: {
    flex: 1
  },
  bgImage: {
    width: wp('100%'),
    height: hp('50%'),
    resizeMode: 'cover'
  },
  bgImage1: {
    paddingTop: Platform.OS === 'ios' ? 45 : 15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timer: {
    fontSize: wp('7%'),
    marginLeft: 10,
    color: '#fff',
    fontFamily: FONTS.BOOK
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: hp('3%')
  },
  skipBtn: {
    borderColor: '#FF2424',
    borderWidth: 2,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('1.5%'),
    marginRight: wp('3%')
  },
  skipCountBtn: {
    position: 'absolute',
    backgroundColor: '#FF2424',
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    right: - wp('3%'),
    top: - wp('3%')
  },
  skipText: {
    fontSize: wp('5%'),
    textTransform: 'uppercase',
    color: '#FF2424',
    fontFamily: FONTS._BOLD
  },
  skipCount: {
    fontFamily: FONTS.BOOK,
    color: '#ffffff'
  },
  userName: {
    fontFamily: FONTS.BOOK,
    fontSize: wp('6%'),
    color: '#ffffff'
  },
  age: {
    fontFamily: FONTS.BOOK,
    fontSize: wp('4%'),
    color: '#ffffff'
  },
  iceBtn: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: 100,
    borderColor: '#57B7EB',
    borderWidth: 4
  },
  iceCount: {
    position: 'absolute',
    backgroundColor: '#57B7EB',
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    right: - wp('2%'),
    top: - wp('2%')
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('10%'),
    borderRadius: wp('5%'),
    width: WIDTH * 0.80,
  },
  modalText: {
    fontSize: wp('4%'),
    fontFamily: FONTS.BOOK,
    textAlign: 'center',
    marginTop: wp('8%')
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 10
  },
  seemeeText: {
    fontFamily: FONTS.BOOK,
    marginLeft: 5
  },
  profileView: {
    height: wp('25%'),
    width: wp('25%'),
    padding: wp('1%'),
    borderRadius: 100,
    position: 'absolute',
    alignSelf: 'center',
    top: -wp('12.5%')
  },
  profile: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 100
  },
  finalModal: {
    position: 'absolute',
    alignSelf: 'center',
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: hp('4%')
  },
  orView: {
    padding: 9,
    borderRadius: 50,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    marginHorizontal: wp('3%')
  },
  orText: {
    fontFamily: FONTS.BOOK,
    fontSize: 11,
  },
  border: {
    width: '30%',
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1
  },
})